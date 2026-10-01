const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  guestName: {
    type: String,
    required: false
  },
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  tableNumber: {
    type: String,
    required: function() { return this.orderType === 'Dine-in'; }
  },
  orderType: {
    type: String,
    enum: ['Dine-in', 'Takeaway'],
    default: 'Dine-in'
  },
  subtotalAmount: {
    type: Number,
    required: false
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  cancelledBy: {
    type: String,
    enum: ['User', 'Staff', 'Admin', ''],
    default: ''
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Unpaid'
  },
  paymentMethod: {
    type: String,
    default: 'Cash / Counter'
  },
  paymentGateway: {
    type: String,
    enum: ['Razorpay', 'Stripe', 'Cash', 'Mock', 'None'],
    default: 'None'
  },
  razorpayOrderId: {
    type: String,
    default: ''
  },
  razorpayPaymentId: {
    type: String,
    default: ''
  },
  razorpaySignature: {
    type: String,
    default: ''
  },
  stripePaymentIntentId: {
    type: String,
    default: ''
  },
  stripeSessionId: {
    type: String,
    default: ''
  },
  paidAt: {
    type: Date,
    default: null
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  transactionId: {
    type: String,
    default: ''
  },
  invoiceNumber: {
    type: String,
    default: ''
  },
  invoiceGeneratedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
