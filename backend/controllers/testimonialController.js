const Testimonial = require('../models/Testimonial');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary').v2;

// Public: submit testimonial
exports.submitTestimonial = asyncErrorHandler(async (req, res, next) => {
  const { name, email, rating, message, imageUrl, role, product, location, time } = req.body;
  if (!name || !email || !rating || !message) {
    return next(new ErrorHandler('All fields are required', 400));
  }
  const doc = await Testimonial.create({
    name,
    email,
    rating,
    message,
    imageUrl,
    role,
    product,
    location,
    time,
    verified: true,
    recommend: true,
    user: req.user?._id,
  });
  res.status(201).json({ success: true, testimonial: doc });
});

// Public: list approved testimonials
exports.getApprovedTestimonials = asyncErrorHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, testimonials });
});

// Admin: list all testimonials
exports.getAllTestimonials = asyncErrorHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, testimonials });
});

// Admin: update status
exports.updateTestimonialStatus = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return next(new ErrorHandler('Invalid status', 400));
  }
  const updated = await Testimonial.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated) return next(new ErrorHandler('Testimonial not found', 404));
  res.status(200).json({ success: true, testimonial: updated });
});

// Admin: delete
exports.deleteTestimonial = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await Testimonial.findByIdAndDelete(id);
  if (!deleted) return next(new ErrorHandler('Testimonial not found', 404));
  res.status(200).json({ success: true });
});

// Upload testimonial image (multipart/form-data field: image)
exports.uploadTestimonialImage = asyncErrorHandler(async (req, res, next) => {
  if (!req.files || !req.files.image) {
    return next(new ErrorHandler('No image file uploaded', 400));
  }
  const file = req.files.image;
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: 'testimonials',
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
  });
  res.status(200).json({ success: true, url: result.secure_url });
});


