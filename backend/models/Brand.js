const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  logo: {
    type: String, // This will store the ImgBB URL
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;