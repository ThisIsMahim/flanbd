const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const {
  submitTestimonial,
  getApprovedTestimonials,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
  uploadTestimonialImage
} = require('../controllers/testimonialController');

// Public
router.post('/testimonial', submitTestimonial);
router.get('/testimonials', getApprovedTestimonials);
router.post('/testimonial/upload', uploadTestimonialImage);

// Admin
router.get('/admin/testimonials', isAuthenticatedUser, authorizeRoles('admin'), getAllTestimonials);
router.put('/admin/testimonial/:id', isAuthenticatedUser, authorizeRoles('admin'), updateTestimonialStatus);
router.delete('/admin/testimonial/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteTestimonial);

module.exports = router;


