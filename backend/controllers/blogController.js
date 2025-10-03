const Blog = require('../models/Blog');
const ErrorHandler = require('../utils/errorHandler');

// Create new blog - ADMIN
exports.createBlog = async (req, res, next) => {
    try {
        const { title, description, imageUrl } = req.body;

        const blog = await Blog.create({
            title,
            description,
            imageUrl,
            author: req.user._id
        });

        res.status(201).json({
            success: true,
            blog
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};

// Get all blogs - PUBLIC
exports.getAllBlogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'name email');

        const total = await Blog.countDocuments();

        res.status(200).json({
            success: true,
            count: blogs.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            blogs
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

// Get single blog details - PUBLIC
exports.getBlogDetails = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name email');

        if (!blog) {
            return next(new ErrorHandler("Blog not found", 404));
        }

        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

// Update blog - ADMIN
exports.updateBlog = async (req, res, next) => {
    try {
        const { title, description, imageUrl } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { 
                title,
                description, 
                imageUrl
            },
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!updatedBlog) {
            return next(new ErrorHandler("Blog not found", 404));
        }

        res.status(200).json({
            success: true,
            blog: updatedBlog
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

// Delete blog - ADMIN
exports.deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return next(new ErrorHandler("Blog not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

// Search blogs - PUBLIC
exports.searchBlogs = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q) {
            return next(new ErrorHandler("Please provide a search query", 400));
        }

        const blogs = await Blog.find(
            { $text: { $search: q } },
            { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } });

        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};