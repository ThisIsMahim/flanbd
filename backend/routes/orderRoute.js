const express = require('express');
const { newOrder, getSingleOrderDetails, myOrders, getAllOrders, updateOrder, deleteOrder, myOrdersSummary, guestOrder, getGuestOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// Authenticated user routes
router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrderDetails);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);
router.route('/orders/me/summary').get(isAuthenticatedUser, myOrdersSummary);

// Guest user routes (no authentication required)
router.route('/order/guest/new').post(guestOrder);
router.route('/order/guest/find').post(getGuestOrder);

// Admin routes
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router.route('/admin/order/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;