const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// User routes
router.get('/', videoController.getAllVideos);

// Admin routes
router.get('/admin', videoController.getAdminVideos);
router.post('/', videoController.addVideo);
// Add this route below the existing routes
router.put('/:id', videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;