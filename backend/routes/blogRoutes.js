const express = require('express');
const { 
    createBlog,
    getBlogDetails, 
    getAllBlogs,
    updateBlog,
    deleteBlog,
    searchBlogs
} = require('../controllers/blogController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.route('/blogs').get(getAllBlogs);
router.route('/blogs/search').get(searchBlogs);
router.route('/blogs/:id').get(getBlogDetails);

// Protected routes (admin only)
router.route('/blogs/new').post(isAuthenticatedUser, authorizeRoles("admin"), createBlog);
router.route('/blog/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateBlog)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteBlog);

module.exports = router;