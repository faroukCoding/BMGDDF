const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getDriverOrders,
  getAllOrders,
  updateOrderStatus,
  assignDriver,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin & Assistant Admin routes
router.route('/')
  .get(protect, authorize('admin', 'assistant_admin'), getAllOrders);

// Affiliate routes
router.route('/')
  .post(protect, authorize('affiliate'), createOrder);

router.route('/my')
  .get(protect, authorize('affiliate'), getMyOrders);

// Driver routes
router.route('/driver')
  .get(protect, authorize('driver'), getDriverOrders);

// Multi-role routes
router.route('/:id/status')
  .put(protect, authorize('assistant_admin', 'driver', 'call_center_agent'), updateOrderStatus);

router.route('/:id/assign')
  .put(protect, authorize('admin', 'assistant_admin'), assignDriver);

module.exports = router;
