const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getPendingOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Affiliate routes
router.route('/')
  .post(protect, authorize('affiliate'), createOrder);

router.route('/my')
  .get(protect, authorize('affiliate'), getMyOrders);

// Assistant Admin routes
router.route('/pending')
  .get(protect, authorize('assistant_admin'), getPendingOrders);

// Assistant Admin and Driver routes
router.route('/:id/status')
  .put(protect, authorize('assistant_admin', 'driver'), updateOrderStatus);

module.exports = router;
