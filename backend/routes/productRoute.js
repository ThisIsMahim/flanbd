const express = require('express');
const { getAllProducts, getProductDetails, updateProduct, deleteProduct, getProductReviews, deleteReview, createProductReview, createProduct, getAdminProducts, getProducts, getAllBrands, bulkUpdateSortOrder, createCoupon, listCoupons, updateCoupon, deleteCoupon, validateCoupon, getHighestOrder, getGentsCollection, getLadiesCollection, getSportsSunglass, getEyewear, getPriceRange } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();
const cache = require("../middlewares/cache");

router.route('/products').get(cache({ ttlMs: 60_000 }), getAllProducts);
router.route('/products/all').get(cache({ ttlMs: 60_000 }), getProducts);
router.route('/products/price-range').get(cache({ ttlMs: 5 * 60_000 }), getPriceRange);
router.route('/brands').get(cache({ ttlMs: 10 * 60_000 }), getAllBrands);

// Dedicated Collection APIs
router.route('/collections/gents').get(cache({ ttlMs: 60_000 }), getGentsCollection);
router.route('/collections/ladies').get(cache({ ttlMs: 60_000 }), getLadiesCollection);
router.route('/collections/sports-sunglass').get(cache({ ttlMs: 60_000 }), getSportsSunglass);
router.route('/collections/eyewear').get(cache({ ttlMs: 60_000 }), getEyewear);

router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route('/products/highest-order').get(getHighestOrder);

router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// Bulk sort order update
router.route('/admin/products/sort-order')
    .put(isAuthenticatedUser, authorizeRoles("admin"), bulkUpdateSortOrder);

router.route('/product/:id').get(cache({ ttlMs: 60_000 }), getProductDetails);

router.route('/review').put(isAuthenticatedUser, createProductReview);


router.route('/admin/reviews')
    .get(isAuthenticatedUser, authorizeRoles("admin"), getProductReviews)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

// Coupon management
router.route('/admin/coupons')
    .get(isAuthenticatedUser, authorizeRoles("admin"), listCoupons)
    .post(isAuthenticatedUser, authorizeRoles("admin"), createCoupon);
router.route('/admin/coupons/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateCoupon)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCoupon);

// Public validate coupon
router.route('/coupons/validate').get(validateCoupon);

module.exports = router;