class SearchFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              name: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              description: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : null;

    if (keyword) {
      this.query = this.query.find(keyword);
    }
    
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing fields from the query
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Array of conditions for $and
    let andConditions = [];

    // Handle price conversion to numbers and range logic
    if (queryCopy.price) {
      const priceFilter = {};
      if (queryCopy.price.gte !== undefined) {
        const gte = Number(queryCopy.price.gte);
        if (!isNaN(gte)) priceFilter.$gte = gte;
      }
      if (queryCopy.price.lte !== undefined) {
        const lte = Number(queryCopy.price.lte);
        if (!isNaN(lte)) priceFilter.$lte = lte;
      }
      
      if (Object.keys(priceFilter).length > 0) {
        if (!(priceFilter.$gte === 0 && priceFilter.$lte >= 200000)) {
           // Support both Number and String types in DB for resilience
           const priceQueries = [];
           if (priceFilter.$gte !== undefined && priceFilter.$lte !== undefined) {
             priceQueries.push({ price: { $gte: priceFilter.$gte, $lte: priceFilter.$lte } });
             priceQueries.push({ price: { $gte: String(priceFilter.$gte), $lte: String(priceFilter.$lte) } });
           } else if (priceFilter.$gte !== undefined) {
             priceQueries.push({ price: { $gte: priceFilter.$gte } });
             priceQueries.push({ price: { $gte: String(priceFilter.$gte) } });
           } else if (priceFilter.$lte !== undefined) {
             priceQueries.push({ price: { $lte: priceFilter.$lte } });
             priceQueries.push({ price: { $lte: String(priceFilter.$lte) } });
           }

           if (priceQueries.length > 0) {
             andConditions.push({ $or: priceQueries });
           }
        }
      }
    }

    if (queryCopy.ratings) {
      const ratingsFilter = {};
      if (queryCopy.ratings.gte !== undefined) {
        const gte = Number(queryCopy.ratings.gte);
        if (!isNaN(gte) && gte > 0) ratingsFilter.$gte = gte;
      }
      if (queryCopy.ratings.lte !== undefined) {
        const lte = Number(queryCopy.ratings.lte);
        if (!isNaN(lte)) ratingsFilter.$lte = lte;
      }

      if (Object.keys(ratingsFilter).length > 0) {
        const ratingsQueries = [];
        ratingsQueries.push({ ratings: ratingsFilter });
        ratingsQueries.push({ ratings: { $gte: String(ratingsFilter.$gte || 0) } });
        andConditions.push({ $or: ratingsQueries });
      }
    }

    // Handle category filtering with ObjectIds
    if (queryCopy.categories) {
      let categoriesArr = queryCopy.categories;
      if (typeof categoriesArr === "string") {
        try {
          categoriesArr = JSON.parse(categoriesArr);
        } catch {
          categoriesArr = [categoriesArr];
        }
      }
      if (!Array.isArray(categoriesArr)) {
        categoriesArr = [categoriesArr];
      }
      
      if (categoriesArr.length > 0) {
        const mongoose = require("mongoose");
        const validObjectIds = categoriesArr.map((id) => {
          try {
            return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
          } catch {
            return null;
          }
        }).filter(id => id !== null);
        
        if (validObjectIds.length > 0) {
          const catQueries = [];
          catQueries.push({ categories: { $in: validObjectIds } });
          catQueries.push({ categories: { $in: categoriesArr.map(id => id.toString()) } });
          andConditions.push({ $or: catQueries });
        }
      }
    }

    // Handle any other fields (brand, etc.)
    const handledFields = ["price", "ratings", "categories"];
    Object.keys(queryCopy).forEach(key => {
      if (!handledFields.includes(key)) {
        if (key === "brand") {
          andConditions.push({ "brand.name": queryCopy[key] });
        } else {
          andConditions.push({ [key]: queryCopy[key] });
        }
      }
    });

    if (andConditions.length > 0) {
      this.query = this.query.find({ $and: andConditions });
    }

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = SearchFeatures;
