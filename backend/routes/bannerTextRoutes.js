const express = require('express');
const router = express.Router();
const bannerTextController = require('../controllers/bannerTextController');

// Get current banner text
router.get('/', bannerTextController.getBannerText);
// Create new banner text
router.post('/', bannerTextController.createBannerText);
// Update banner text by ID
router.put('/:id', bannerTextController.updateBannerText);

module.exports = router; 