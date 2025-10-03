const express = require('express');
const { 
    createCategory,
    getCategoryDetails, 
    getAllCategories,
    updateCategory,
    deleteCategory,
    updateCategoryOrder
} = require('../controllers/categoryController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();
const cache = require("../middlewares/cache");

// Public routes (no authentication required)
router.route('/categories').get(cache({ ttlMs: 5 * 60_000 }), getAllCategories);

// Protected routes (admin only)
router.route('/admin/category/new').post(isAuthenticatedUser, authorizeRoles("admin"), createCategory);
router.route('/admin/category/order').put(isAuthenticatedUser, authorizeRoles("admin"), updateCategoryOrder);

router.route('/admin/category/:id')
    .get(isAuthenticatedUser, authorizeRoles("admin"), getCategoryDetails)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateCategory)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCategory);

module.exports = router;