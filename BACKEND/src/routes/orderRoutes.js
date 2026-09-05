const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrderByUser,
  payOnlineOrder,
  generateOrderInvoice,
  getUserSpendingSummary
} = require('../controllers/orderController');
const { protect, authorize, optionalProtect } = require('../middleware/auth');

router
  .route('/')
  .post(optionalProtect, createOrder)
  .get(protect, authorize('admin', 'staff'), getOrders);

router.get('/my-orders', protect, getMyOrders);
router.get('/user-spending', protect, getUserSpendingSummary);

router.route('/:id').get(getOrderById);

router.put('/:id/cancel-user', cancelOrderByUser);
router.post('/:id/pay-online', payOnlineOrder);
router.post('/:id/generate-invoice', protect, authorize('admin', 'staff'), generateOrderInvoice);

router.put('/:id/status', protect, authorize('admin', 'staff'), updateOrderStatus);
router.put('/:id/payment', protect, authorize('admin', 'staff'), updatePaymentStatus);

module.exports = router;
