const express = require('express');
const router = express.Router();
const userMessageController = require('../controllers/userMessageController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Public routes
router.post('/', userMessageController.createMessage);

// Admin routes
router.get('/', isAuthenticatedUser, authorizeRoles('admin'), userMessageController.getAllMessages);
router.delete('/:id', isAuthenticatedUser, authorizeRoles('admin'), userMessageController.deleteMessage);
router.put('/:id/status', isAuthenticatedUser, authorizeRoles('admin'), userMessageController.updateMessageStatus);

module.exports = router;