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

    // Filter for Price and Ratings
    let filter = {};

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
      
      // Only apply price filter if it's not the default "everything" range
      // or if it has meaningful values
      if (Object.keys(priceFilter).length > 0) {
        // If it's [0, 200000] (common default), we might want to skip it to be safe
        // but let's keep it if specifically requested. 
        // However, if gte is 0 and lte is very high, it's effectively "all".
        if (!(priceFilter.$gte === 0 && priceFilter.$lte >= 200000)) {
           filter.price = priceFilter;
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
        filter.ratings = ratingsFilter;
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
          filter.categories = { $in: validObjectIds };
        }
      }
    }

    // Handle any other fields that might be in queryCopy
    const handledFields = ["price", "ratings", "categories"];
    Object.keys(queryCopy).forEach(key => {
      if (!handledFields.includes(key)) {
        filter[key] = queryCopy[key];
      }
    });

    this.query = this.query.find(filter);
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
