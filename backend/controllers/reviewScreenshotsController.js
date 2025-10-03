const ReviewScreenshot = require("../models/ReviewScreenshot");
const ErrorHandler = require("../utils/errorHandler");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Get all review screenshots (sorted by order)
exports.getAllScreenshots = asyncErrorHandler(async (req, res, next) => {
  const screenshots = await ReviewScreenshot.find().sort({
    order: 1,
    createdAt: 1,
  });
  res
    .status(200)
    .json(screenshots.map((s) => ({ id: s._id, url: s.url, order: s.order })));
});

// Upload a new review screenshot (store only URL from ImgBB)
exports.uploadScreenshot = asyncErrorHandler(async (req, res, next) => {
  const { url } = req.body;
  if (!url) {
    return next(new ErrorHandler("No image URL provided", 400));
  }
  const count = await ReviewScreenshot.countDocuments();
  const screenshot = await ReviewScreenshot.create({
    url,
    public_id: url,
    order: count,
  });
  res
    .status(201)
    .json({ id: screenshot._id, url: screenshot.url, order: screenshot.order });
});

// Delete a review screenshot
exports.deleteScreenshot = asyncErrorHandler(async (req, res, next) => {
  const screenshot = await ReviewScreenshot.findById(req.params.id);
  if (!screenshot) {
    return next(new ErrorHandler("Screenshot not found", 404));
  }
  await screenshot.deleteOne();
  res.status(200).json({ success: true });
});

// Reorder screenshots
exports.reorderScreenshots = asyncErrorHandler(async (req, res, next) => {
  const { order } = req.body; // order: [id1, id2, ...]
  if (!Array.isArray(order)) {
    return next(new ErrorHandler("Order must be an array", 400));
  }
  for (let i = 0; i < order.length; i++) {
    await ReviewScreenshot.findByIdAndUpdate(order[i], { order: i });
  }
  res.status(200).json({ success: true });
});
