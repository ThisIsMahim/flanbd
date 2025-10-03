const Slider = require("../models/Slider");
const ErrorHandler = require("../utils/errorHandler");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const mongoose = require("mongoose");

// Get all sliders
exports.getAllSliders = asyncErrorHandler(async (req, res, next) => {
  const { language } = req.query;

  const query = {};
  if (language) {
    query.language = language;
  }

  const sliders = await Slider.find(query).sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: sliders.length,
    data: sliders,
  });
});

// Get single slider
exports.getSlider = asyncErrorHandler(async (req, res, next) => {
  const slider = await Slider.findById(req.params.id);

  if (!slider) {
    return next(new ErrorHandler("Slider not found", 404));
  }

  res.status(200).json({
    success: true,
    data: slider,
  });
});

// Create new slider
exports.createSlider = asyncErrorHandler(async (req, res, next) => {
  const { title, subtitle, features, language, isActive, order, mobileContain } = req.body;

  if (!req.body.imageUrl) {
    return next(new ErrorHandler("Image URL is required", 400));
  }

  const slider = await Slider.create({
    title,
    subtitle,
    imageUrl: req.body.imageUrl,
    features: Array.isArray(features) ? features : [features],
    language,
    isActive,
    order,
    mobileContain: typeof mobileContain !== 'undefined' ? mobileContain : true,
  });

  res.status(201).json({
    success: true,
    data: slider,
  });
});

// Update slider
exports.updateSlider = asyncErrorHandler(async (req, res, next) => {
  const { title, subtitle, features, language, isActive, order, mobileContain } = req.body;

  const slider = await Slider.findById(req.params.id);

  if (!slider) {
    return next(new ErrorHandler("Slider not found", 404));
  }

  slider.title = title || slider.title;
  slider.subtitle = subtitle || slider.subtitle;
  slider.features = Array.isArray(features)
    ? features
    : [features] || slider.features;
  slider.language = language || slider.language;
  slider.isActive =
    typeof isActive !== "undefined" ? isActive : slider.isActive;
  slider.order = order || slider.order;
  if (typeof mobileContain !== 'undefined') slider.mobileContain = mobileContain;

  if (req.body.imageUrl) {
    slider.imageUrl = req.body.imageUrl;
  }

  await slider.save();

  res.status(200).json({
    success: true,
    data: slider,
  });
});

// Delete slider
// Delete slider
exports.deleteSlider = asyncErrorHandler(async (req, res, next) => {
  const slider = await Slider.findById(req.params.id);

  if (!slider) {
    return next(new ErrorHandler("Slider not found", 404));
  }

  await slider.deleteOne(); // ✅ this is the correct method in newer Mongoose versions

  res.status(200).json({
    success: true,
    message: "Slider deleted successfully",
  });
});

// Reorder sliders
exports.reorderSliders = asyncErrorHandler(async (req, res, next) => {
  const { sliders } = req.body;

  if (!Array.isArray(sliders)) {
    return next(new ErrorHandler("Invalid slider data", 400));
  }

  // Filter out invalid ObjectIds
  const validSliders = sliders.filter(
    (s) =>
      s._id &&
      typeof s._id === "string" &&
      mongoose.Types.ObjectId.isValid(s._id)
  );

  if (validSliders.length === 0) {
    return next(new ErrorHandler("No valid slider IDs provided", 400));
  }

  const bulkOps = validSliders.map((slider) => ({
    updateOne: {
      filter: { _id: slider._id },
      update: { $set: { order: slider.order } },
    },
  }));

  await Slider.bulkWrite(bulkOps);

  res.status(200).json({
    success: true,
    message: "Sliders reordered successfully",
    skipped: sliders.length - validSliders.length,
  });
});
