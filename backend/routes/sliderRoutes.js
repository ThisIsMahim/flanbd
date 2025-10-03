const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Public routes
router.get('/sliders',sliderController.getAllSliders);
router.get('/sliders/:id', sliderController.getSlider);

// Admin routes - protected
router.post('/sliders', 
  isAuthenticatedUser, 
  authorizeRoles('admin'), 
  sliderController.createSlider
);

router.put('/sliders/:id', 
  isAuthenticatedUser, 
  authorizeRoles('admin'), 
  sliderController.updateSlider
);

router.delete('/sliders/:id', 
  isAuthenticatedUser, 
  authorizeRoles('admin'), 
  sliderController.deleteSlider
);

router.post('/sliders/reorder', 
  isAuthenticatedUser, 
  authorizeRoles('admin'), 
  sliderController.reorderSliders
);

module.exports = router;