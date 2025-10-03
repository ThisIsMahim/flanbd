const Category = require("../models/categoryModel");
const ErrorHandler = require("../utils/errorHandler");

// Create new category - ADMIN
exports.createCategory = async (req, res, next) => {
  try {
    const {
      name,
      description,
      subtext,
      icon,
      videoLinks,
      isTopSelling,
      parent,
    } = req.body;

    const category = await Category.create({
      name,
      description,
      subtext,
      icon: icon || null, // Make icon optional
      videoLinks: videoLinks || [], // Keep as empty array if not provided
      isTopSelling: isTopSelling || false,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      parent: parent || null,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// Get all categories - PUBLIC
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .sort({ order: 1, createdAt: -1 })
      .populate("parent", "name _id");

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Get single category details - ADMIN
exports.getCategoryDetails = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Update category - ADMIN
exports.updateCategory = async (req, res, next) => {
  try {
    const {
      name,
      description,
      subtext,
      icon,
      videoLinks,
      isTopSelling,
      parent,
    } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        subtext,
        icon: icon || null, // Make icon optional
        videoLinks: videoLinks || [], // Keep as empty array if not provided
        isTopSelling: isTopSelling || false,
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        parent: parent || null,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return next(new ErrorHandler("Category not found", 404));
    }

    res.status(200).json({
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Delete category - ADMIN
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Update category order - ADMIN
exports.updateCategoryOrder = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return next(new ErrorHandler("Invalid category order data", 400));
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index + 1 } },
      },
    }));

    await Category.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: "Category order updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
