const Razorpay = require('razorpay');
const Stripe = require('stripe');

// Check if Razorpay keys are configured
const isRazorpayConfigured = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return (
    keyId &&
    keySecret &&
    !keyId.includes('placeholder') &&
    !keySecret.includes('placeholder') &&
    keyId.trim().length > 0 &&
    keySecret.trim().length > 0
  );
};

// Check if Stripe keys are configured
const isStripeConfigured = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return (
    secretKey &&
    !secretKey.includes('placeholder') &&
    secretKey.trim().length > 0
  );
};

// Initialize Razorpay client
let razorpayInstance = null;
if (isRazorpayConfigured()) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✓ Razorpay payment gateway initialized successfully');
  } catch (err) {
    console.warn('⚠️ Razorpay initialization failed:', err.message);
  }
} else {
  console.log('ℹ️ Razorpay running in Sandbox/Test Simulation mode (keys not configured or placeholders used)');
}

// Initialize Stripe client
let stripeInstance = null;
if (isStripeConfigured()) {
  try {
    stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('✓ Stripe payment gateway initialized successfully');
  } catch (err) {
    console.warn('⚠️ Stripe initialization failed:', err.message);
  }
} else {
  console.log('ℹ️ Stripe running in Sandbox/Test Simulation mode (keys not configured or placeholders used)');
}

const getPaymentConfig = () => {
  return {
    activeGateway: process.env.PAYMENT_GATEWAY || 'both', // 'razorpay', 'stripe', or 'both'
    currency: process.env.CURRENCY || 'INR',
    razorpay: {
      isConfigured: isRazorpayConfigured(),
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
    },
    stripe: {
      isConfigured: isStripeConfigured(),
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
    }
  };
};

module.exports = {
  razorpayInstance,
  stripeInstance,
  isRazorpayConfigured,
  isStripeConfigured,
  getPaymentConfig
};
