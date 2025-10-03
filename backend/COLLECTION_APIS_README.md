# Collection APIs Documentation

## Overview
This document describes the new dedicated Collection APIs that provide optimized product fetching for specific eyewear collections. These APIs replace the generic product filtering with specialized endpoints for better performance and cleaner code.

## API Endpoints

### 1. Gents Collection API
**Endpoint:** `GET /api/v1/collections/gents`

**Description:** Fetches all products belonging to the Gents Collection category and its subcategories.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of products per page (default: 12)
- `brand` (optional): Filter by brand name
- `price[gte]` (optional): Minimum price filter
- `price[lte]` (optional): Maximum price filter
- `ratings[gte]` (optional): Minimum rating filter

**Response:**
```json
{
  "success": true,
  "products": [...],
  "totalProducts": 45,
  "totalPages": 4,
  "currentPage": 1,
  "productsPerPage": 12,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

### 2. Ladies Collection API
**Endpoint:** `GET /api/v1/collections/ladies`

**Description:** Fetches all products belonging to the Ladies Collection category and its subcategories.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of products per page (default: 12)
- `brand` (optional): Filter by brand name
- `price[gte]` (optional): Minimum price filter
- `price[lte]` (optional): Maximum price filter
- `ratings[gte]` (optional): Minimum rating filter
- `color` (optional): Filter by color (case-insensitive)

**Response:** Same structure as Gents Collection API

### 3. Sports Sunglass API
**Endpoint:** `GET /api/v1/collections/sports-sunglass`

**Description:** Fetches all products belonging to the Sports Sunglass category and its subcategories.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of products per page (default: 12)
- `brand` (optional): Filter by brand name
- `price[gte]` (optional): Minimum price filter
- `price[lte]` (optional): Maximum price filter
- `ratings[gte]` (optional): Minimum rating filter
- `sportType` (optional): Filter by sport type (case-insensitive)

**Response:** Same structure as Gents Collection API

### 4. Eyewear API
**Endpoint:** `GET /api/v1/collections/eyewear`

**Description:** Fetches all products belonging to the Eyewear category and its subcategories.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of products per page (default: 12)
- `brand` (optional): Filter by brand name
- `price[gte]` (optional): Minimum price filter
- `price[lte]` (optional): Maximum price filter
- `ratings[gte]` (optional): Minimum rating filter
- `eyewearType` (optional): Filter by eyewear type (case-insensitive)

**Response:** Same structure as Gents Collection API

## Features

### 1. Automatic Category Resolution
- Each API automatically finds the main category and all its subcategories
- Uses recursive category lookup for comprehensive product coverage
- No need to manually specify category IDs

### 2. Built-in Filtering
- Brand filtering
- Price range filtering
- Rating filtering
- Category-specific filtering (color for ladies, sport type for sports, eyewear type for eyewear)

### 3. Pagination Support
- Configurable page size
- Page navigation information
- Efficient database queries with skip/limit

### 4. Performance Optimizations
- Cached responses (60 seconds TTL)
- Optimized database queries
- Proper indexing on categories field

### 5. Error Handling
- Comprehensive error messages
- Proper HTTP status codes
- Graceful fallbacks

## Usage Examples

### Frontend Implementation

#### Before (Generic API):
```javascript
// Old way - using generic products API
const response = await axios.get(
  `${process.env.REACT_APP_BACKEND_URL}/api/v1/products?category=Gents Sunglass`
);
```

#### After (Dedicated API):
```javascript
// New way - using dedicated collection API
const response = await axios.get(
  `${process.env.REACT_APP_BACKEND_URL}/api/v1/collections/gents`
);
```

### Backend Implementation

#### Controller Functions:
```javascript
// New dedicated functions in productController.js
exports.getGentsCollection = asyncErrorHandler(async (req, res, next) => { ... });
exports.getLadiesCollection = asyncErrorHandler(async (req, res, next) => { ... });
exports.getSportsSunglass = asyncErrorHandler(async (req, res, next) => { ... });
exports.getEyewear = asyncErrorHandler(async (req, res, next) => { ... });
```

#### Routes:
```javascript
// New routes in productRoute.js
router.route('/collections/gents').get(cache({ ttlMs: 60_000 }), getGentsCollection);
router.route('/collections/ladies').get(cache({ ttlMs: 60_000 }), getLadiesCollection);
router.route('/collections/sports-sunglass').get(cache({ ttlMs: 60_000 }), getSportsSunglass);
router.route('/collections/eyewear').get(cache({ ttlMs: 60_000 }), getEyewear);
```

## Benefits

### 1. Performance
- Faster response times due to optimized queries
- Reduced database load
- Better caching strategies

### 2. Maintainability
- Cleaner, more focused code
- Easier to debug and modify
- Better separation of concerns

### 3. Scalability
- Independent scaling of different collections
- Easier to add collection-specific features
- Better resource management

### 4. User Experience
- Faster page loads
- More responsive filtering
- Better error handling

## Migration Guide

### Step 1: Update Frontend API Calls
Replace all generic product API calls with dedicated collection API calls:

```javascript
// Old
`${process.env.REACT_APP_BACKEND_URL}/api/v1/products?category=Gents Sunglass`

// New
`${process.env.REACT_APP_BACKEND_URL}/api/v1/collections/gents`
```

### Step 2: Update Response Handling
The new APIs return additional pagination information:

```javascript
// Old response structure
{
  success: true,
  products: [...]
}

// New response structure
{
  success: true,
  products: [...],
  totalProducts: 45,
  totalPages: 4,
  currentPage: 1,
  productsPerPage: 12,
  hasNextPage: true,
  hasPrevPage: false
}
```

### Step 3: Test and Validate
- Test all collection pages
- Verify filtering works correctly
- Check pagination functionality
- Validate error handling

## Error Codes

- `404`: Category not found
- `500`: Internal server error
- `200`: Success

## Caching

All collection APIs are cached for 60 seconds to improve performance. Cache can be adjusted in the route configuration:

```javascript
router.route('/collections/gents').get(cache({ ttlMs: 60_000 }), getGentsCollection);
```

## Future Enhancements

1. **Advanced Filtering**: Add more filter options like material, frame type, etc.
2. **Search Integration**: Add full-text search within collections
3. **Recommendations**: Add product recommendation algorithms
4. **Analytics**: Track collection performance and user behavior
5. **Personalization**: User-specific collection preferences

## Support

For questions or issues with the Collection APIs, please refer to:
- Product Controller: `backend/controllers/productController.js`
- Product Routes: `backend/routes/productRoute.js`
- This documentation: `backend/COLLECTION_APIS_README.md`
