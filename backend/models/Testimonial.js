const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    message: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: false },
    role: { type: String, required: false, trim: true },
    product: { type: String, required: false, trim: true },
    location: { type: String, required: false, trim: true },
    time: { type: String, required: false, trim: true },
    verified: { type: Boolean, default: true },
    recommend: { type: Boolean, default: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);


