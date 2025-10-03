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
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing fields from the query
    const removeFields = ["keyword", "page", "limit", "rentOnly"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Handle category filtering with ObjectIds
    if (queryCopy.categories) {
      // If categories is a string, make it an array
      let categoriesArr = queryCopy.categories;
      if (typeof categoriesArr === "string") {
        try {
          categoriesArr = JSON.parse(categoriesArr);
        } catch {
          categoriesArr = [categoriesArr];
        }
      }
      // Ensure it's an array
      if (!Array.isArray(categoriesArr)) {
        categoriesArr = [categoriesArr];
      }
      
      // Only apply filter if we have valid categories
      if (categoriesArr.length > 0) {
        // Convert to ObjectId if possible
        const mongoose = require("mongoose");
        const validObjectIds = categoriesArr.map((id) => {
          try {
            return new mongoose.Types.ObjectId(id);
          } catch (error) {
            // If it's not a valid ObjectId, skip it
            return null;
          }
        }).filter(id => id !== null); // Remove null values
        
        // Only apply filter if we have valid ObjectIds
        if (validObjectIds.length > 0) {
          queryCopy.categories = {
            $in: validObjectIds,
          };
        } else {
          // If no valid ObjectIds, remove categories from query
          delete queryCopy.categories;
        }
      } else {
        // If empty array, remove categories from query
        delete queryCopy.categories;
      }
    }

    // Filter for Price and Ratings
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    // Parse the query string to an object
    const filter = JSON.parse(queryStr);

    // Add isRent filter if rentOnly is true
    if (this.queryStr.rentOnly === "true") {
      filter.isRent = true;
    }

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
