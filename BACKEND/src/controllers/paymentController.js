const crypto = require('crypto');
const Order = require('../models/Order');
const {
  razorpayInstance,
  stripeInstance,
  isRazorpayConfigured,
  isStripeConfigured,
  getPaymentConfig
} = require('../config/paymentConfig');

// Helper to ensure invoice details are created
const ensureInvoice = (order) => {
  if (!order.invoiceNumber) {
    order.invoiceNumber = `INV-${new Date().getFullYear()}-${order._id.toString().substring(18).toUpperCase()}`;
    order.invoiceGeneratedAt = new Date();
  }
  if (!order.subtotalAmount) {
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    order.subtotalAmount = subtotal;
    order.taxAmount = parseFloat((subtotal * 0.05).toFixed(2));
  }
};

// @desc    Get public payment gateway configuration
// @route   GET /api/payment/config
// @access  Public
exports.getConfig = async (req, res) => {
  try {
    const config = getPaymentConfig();
    res.status(200).json({
      success: true,
      data: {
        activeGateway: config.activeGateway,
        currency: config.currency,
        razorpay: {
          keyId: config.razorpay.keyId,
          isConfigured: config.razorpay.isConfigured
        },
        stripe: {
          publishableKey: config.stripe.publishableKey,
          isConfigured: config.stripe.isConfigured
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// RAZORPAY INTEGRATION
// ==========================================

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay/create-order
// @access  Public
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot process payment for a cancelled order' });
    }

    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    const amountInPaise = Math.round(order.totalAmount * 100);
    const currency = process.env.CURRENCY || 'INR';

    let rzpOrderData = null;
    const isConfigured = isRazorpayConfigured() && razorpayInstance;

    if (isConfigured) {
      const options = {
        amount: amountInPaise,
        currency: currency,
        receipt: `rcpt_${order._id.toString().substring(18)}`,
        notes: {
          orderId: order._id.toString(),
          orderType: order.orderType,
          tableNumber: order.tableNumber || 'N/A'
        }
      };

      rzpOrderData = await razorpayInstance.orders.create(options);
    } else {
      // Sandbox Mock Mode fallback
      rzpOrderData = {
        id: `order_mock_${Math.random().toString(36).substring(2, 12)}`,
        entity: 'order',
        amount: amountInPaise,
        amount_paid: 0,
        amount_due: amountInPaise,
        currency: currency,
        receipt: `rcpt_${order._id.toString().substring(18)}`,
        status: 'created',
        attempts: 0,
        notes: {
          orderId: order._id.toString()
        },
        created_at: Math.floor(Date.now() / 1000)
      };
    }

    order.razorpayOrderId = rzpOrderData.id;
    order.paymentGateway = 'Razorpay';
    order.paymentStatus = 'Pending';
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        order: rzpOrderData,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        currency: currency,
        amount: order.totalAmount,
        amountInPaise: amountInPaise,
        orderId: order._id,
        isMock: !isConfigured
      }
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create Razorpay order' });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/razorpay/verify
// @access  Public
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod,
      isMock
    } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, Razorpay Order ID, and Payment ID are required'
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isConfigured = isRazorpayConfigured();

    if (isConfigured && !isMock) {
      if (!razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Signature missing for verification' });
      }

      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      const isSignatureValid = expectedSignature === razorpay_signature;

      if (!isSignatureValid) {
        order.paymentStatus = 'Failed';
        await order.save();
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Invalid cryptographic signature'
        });
      }
    }

    // Payment Signature is Valid or Mock Sandbox Verified
    order.paymentStatus = 'Paid';
    order.paymentGateway = 'Razorpay';
    order.paymentMethod = paymentMethod || 'Online - Razorpay';
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature || 'verified_signature';
    order.transactionId = razorpay_payment_id;
    order.paidAt = new Date();

    ensureInvoice(order);
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('items.menuItem');

    res.status(200).json({
      success: true,
      message: 'Razorpay payment verified successfully',
      data: populatedOrder
    });
  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Payment verification failed' });
  }
};

// ==========================================
// STRIPE INTEGRATION
// ==========================================

// @desc    Create Stripe PaymentIntent
// @route   POST /api/payment/stripe/create-payment-intent
// @access  Public
exports.createStripePaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot process payment for a cancelled order' });
    }

    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    const amountInSmallestUnit = Math.round(order.totalAmount * 100);
    const currency = (process.env.CURRENCY || 'inr').toLowerCase();
    const isConfigured = isStripeConfigured() && stripeInstance;

    let clientSecret = '';
    let paymentIntentId = '';

    if (isConfigured) {
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: amountInSmallestUnit,
        currency: currency,
        description: `Restaurant Order #${order._id.toString().slice(-6)}`,
        metadata: {
          orderId: order._id.toString(),
          orderType: order.orderType,
          tableNumber: order.tableNumber || 'N/A'
        },
        automatic_payment_methods: {
          enabled: true
        }
      });

      clientSecret = paymentIntent.client_secret;
      paymentIntentId = paymentIntent.id;
    } else {
      // Sandbox Mock Mode fallback
      paymentIntentId = `pi_mock_${Math.random().toString(36).substring(2, 12)}`;
      clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substring(2, 12)}`;
    }

    order.stripePaymentIntentId = paymentIntentId;
    order.paymentGateway = 'Stripe';
    order.paymentStatus = 'Pending';
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        clientSecret,
        paymentIntentId,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
        amount: order.totalAmount,
        currency,
        orderId: order._id,
        isMock: !isConfigured
      }
    });
  } catch (error) {
    console.error('Stripe PaymentIntent Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to initialize Stripe payment' });
  }
};

// @desc    Verify / Confirm Stripe Payment
// @route   POST /api/payment/stripe/verify
// @access  Public
exports.verifyStripePayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId, isMock, paymentMethod } = req.body;

    if (!orderId || !paymentIntentId) {
      return res.status(400).json({ success: false, message: 'Order ID and PaymentIntent ID are required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isConfigured = isStripeConfigured() && stripeInstance;

    if (isConfigured && !isMock) {
      const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        order.paymentStatus = 'Failed';
        await order.save();
        return res.status(400).json({
          success: false,
          message: `Stripe payment is in '${paymentIntent.status}' status, not succeeded`
        });
      }
    }

    // Payment is Succeeded or Mock Sandbox Confirmed
    order.paymentStatus = 'Paid';
    order.paymentGateway = 'Stripe';
    order.paymentMethod = paymentMethod || 'Online - Stripe';
    order.stripePaymentIntentId = paymentIntentId;
    order.transactionId = paymentIntentId;
    order.paidAt = new Date();

    ensureInvoice(order);
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('items.menuItem');

    res.status(200).json({
      success: true,
      message: 'Stripe payment confirmed successfully',
      data: populatedOrder
    });
  } catch (error) {
    console.error('Stripe Confirmation Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Payment confirmation failed' });
  }
};

// @desc    Create Stripe Checkout Session (Redirect Flow)
// @route   POST /api/payment/stripe/create-checkout-session
// @access  Public
exports.createStripeCheckoutSession = async (req, res) => {
  try {
    const { orderId, successUrl, cancelUrl } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId).populate('items.menuItem');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isConfigured = isStripeConfigured() && stripeInstance;

    if (!isConfigured) {
      return res.status(400).json({
        success: false,
        message: 'Stripe is running in test sandbox mode. Use embedded card flow or provide Stripe Secret Key.'
      });
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: (process.env.CURRENCY || 'inr').toLowerCase(),
        product_data: {
          name: item.menuItem?.name || 'Restaurant Item',
          description: item.menuItem?.category || 'Dining Item'
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }));

    // Add tax if present
    if (order.taxAmount && order.taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: (process.env.CURRENCY || 'inr').toLowerCase(),
          product_data: {
            name: 'GST / Taxes (5%)'
          },
          unit_amount: Math.round(order.taxAmount * 100)
        },
        quantity: 1
      });
    }

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `http://localhost:3000/orders/${order._id}?payment_status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `http://localhost:3000/orders/${order._id}?payment_status=cancelled`,
      metadata: {
        orderId: order._id.toString()
      }
    });

    order.stripeSessionId = session.id;
    order.paymentGateway = 'Stripe';
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    console.error('Stripe Checkout Session Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create Stripe Checkout session' });
  }
};
