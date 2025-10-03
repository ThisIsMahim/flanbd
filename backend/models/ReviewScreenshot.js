const mongoose = require("mongoose");

const reviewScreenshotSchema = new mongoose.Schema({
  public_id: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ReviewScreenshot", reviewScreenshotSchema);
