const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true
  },
  subtitle: {
    type: String,
    // required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  mobileContain: {
    type: Boolean,
    default: true
  },
  features: {
    type: [String],
    required: true
  },
  language: {
    type: String,
    enum: ['english', 'bangla'],
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Slider = mongoose.model('Slider', sliderSchema);

module.exports = Slider;