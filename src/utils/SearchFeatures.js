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
                        }
                    },
                    {
                        categories: {
                            $regex: this.queryStr.keyword,
                            $options: "i",
                        }
                    }
                ]
            }
            : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        
        // Removing fields from the query
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Handle category filtering
        if (queryCopy.category) {
            const category = queryCopy.category;
            delete queryCopy.category;
            
            // Use $in operator to match any category in the array
            queryCopy.categories = {
                $in: [category]
            };
        }

        // Filter for Price and Ratings
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        const filter = JSON.parse(queryStr);

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