const express = require('express');
const router = express.Router();
const {
  getConfig,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripePaymentIntent,
  verifyStripePayment,
  createStripeCheckoutSession
} = require('../controllers/paymentController');

// Public route to get payment gateway config (public keys, active status)
router.get('/config', getConfig);

// Razorpay routes
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);

// Stripe routes
router.post('/stripe/create-payment-intent', createStripePaymentIntent);
router.post('/stripe/verify', verifyStripePayment);
router.post('/stripe/create-checkout-session', createStripeCheckoutSession);

module.exports = router;
