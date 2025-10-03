const express = require('express');
const fraudCheckerController = require('../controllers/fraudCheckerController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(isAuthenticatedUser);

// Manual fraud check
router.post('/check', authorizeRoles('admin'), fraudCheckerController.checkFraud);

// Bulk fraud check for all orders
router.post('/bulk-check', authorizeRoles('admin'), fraudCheckerController.bulkFraudCheck);

// Test fraud check (for debugging)
router.post('/test', fraudCheckerController.testFraudCheck);

// Test individual courier endpoints (for debugging)
router.post('/test/steadfast', authorizeRoles('admin'), fraudCheckerController.testSteadfast);
router.post('/test/pathao', authorizeRoles('admin'), fraudCheckerController.testPathao);
router.post('/test/redx', authorizeRoles('admin'), fraudCheckerController.testRedX);
router.post('/test/paperfly', authorizeRoles('admin'), fraudCheckerController.testPaperFly);

// Get fraud check history for a phone number
router.get('/history/:phoneNumber', authorizeRoles('admin'), fraudCheckerController.getFraudHistory);

// Get fraud statistics for admin dashboard
router.get('/stats', authorizeRoles('admin'), fraudCheckerController.getFraudStats);

// Get recent fraud checks
router.get('/recent', authorizeRoles('admin'), fraudCheckerController.getRecentFraudChecks);

// Get fraud check details for a specific order
router.get('/order/:orderId', authorizeRoles('admin'), fraudCheckerController.getOrderFraudCheck);

// Perform fraud check for an existing order
router.post('/order/:orderId/check', authorizeRoles('admin'), fraudCheckerController.performOrderFraudCheck);

// Get fraud alerts (high risk orders)
router.get('/alerts', authorizeRoles('admin'), fraudCheckerController.getFraudAlerts);

// Export fraud check data for analysis
router.get('/export', authorizeRoles('admin'), fraudCheckerController.exportFraudData);

module.exports = router;
