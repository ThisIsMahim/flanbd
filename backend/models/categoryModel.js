const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter category name"],
    trim: true,
    unique: true,
    maxlength: [50, "Category name cannot exceed 50 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  subtext: {
    type: String,
    trim: true,
    maxlength: [100, "Subtext cannot exceed 100 characters"],
  },
  icon: {
    type: String,
    required: false, // Make icon optional
  },
  videoLinks: {
    type: [String],
    default: [],
  },
  isTopSelling: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

// Generate slug before saving
categorySchema.pre("save", function (next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  next();
});

module.exports = mongoose.model("Category", categorySchema);
