const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Optional Customer Auth)
exports.createOrder = async (req, res) => {
  try {
    const { items, tableNumber, orderType, guestName, paymentMethod, isPaidOnline } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // Verify items and compute total amount using current database prices
    let computedItems = [];
    let subtotal = 0;

    for (let item of items) {
      const dbMenuItem = await MenuItem.findById(item.menuItem);
      if (!dbMenuItem) {
        return res.status(404).json({ success: false, message: `Menu item not found: ${item.menuItem}` });
      }
      if (!dbMenuItem.isAvailable) {
        return res.status(400).json({ success: false, message: `Item ${dbMenuItem.name} is currently unavailable` });
      }

      const itemTotal = dbMenuItem.price * item.quantity;
      subtotal += itemTotal;

      computedItems.push({
        menuItem: dbMenuItem._id,
        quantity: item.quantity,
        price: dbMenuItem.price
      });
    }

    // 5% Restaurant GST / Tax calculation
    const taxAmount = parseFloat((subtotal * 0.05).toFixed(2));
    const totalAmount = parseFloat((subtotal + taxAmount).toFixed(2));

    // Prepare order details
    const orderData = {
      items: computedItems,
      subtotalAmount: subtotal,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      orderType: orderType || 'Dine-in',
      paymentMethod: paymentMethod || 'Cash / Counter',
      paymentStatus: isPaidOnline ? 'Paid' : 'Unpaid',
      transactionId: isPaidOnline ? 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase() + Date.now().toString().substring(8) : ''
    };

    if (orderData.orderType === 'Dine-in') {
      if (!tableNumber) {
        return res.status(400).json({ success: false, message: 'Table number is required for Dine-in orders' });
      }
      orderData.tableNumber = tableNumber;

      // Mark the table as Occupied
      const table = await Table.findOne({ number: tableNumber });
      if (table) {
        table.status = 'Occupied';
        await table.save();
      }
    }

    // Associate user if logged in
    if (req.user) {
      orderData.user = req.user._id;
    } else if (guestName) {
      orderData.guestName = guestName;
    }

    const order = await Order.create(orderData);

    // If table existed, associate currentOrderId
    if (orderData.orderType === 'Dine-in') {
      const table = await Table.findOne({ number: tableNumber });
      if (table) {
        table.currentOrderId = order._id;
        await table.save();
      }
    }

    // Populate and return
    const populatedOrder = await Order.findById(order._id).populate('items.menuItem');

    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's spending summary & stats
// @route   GET /api/orders/user-spending
// @access  Private
exports.getUserSpendingSummary = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    // Calculate total spend on valid orders
    const totalSpent = orders
      .filter(o => o.status !== 'Cancelled' && (o.paymentStatus === 'Paid' || o.status === 'Completed'))
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => ['Pending', 'Preparing', 'Ready'].includes(o.status)).length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

    res.status(200).json({
      success: true,
      data: {
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        totalOrders,
        activeOrders,
        completedOrders,
        cancelledOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin/Staff)
// @route   GET /api/orders
// @access  Private (Admin, Staff)
exports.getOrders = async (req, res) => {
  try {
    const { status, limit } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    const maxLimit = parseInt(limit, 10) || 100;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.menuItem')
      .sort({ createdAt: -1 })
      .limit(maxLimit);

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Customer cancel their own order with a reason
// @route   PUT /api/orders/:id/cancel-user
// @access  Public (Optional Customer Auth)
exports.cancelOrderByUser = async (req, res) => {
  try {
    const { reason, note } = req.body;
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only allow cancelling if order is in Pending or Preparing state
    if (order.status === 'Ready' || order.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Order is already being served or completed and cannot be cancelled automatically. Please contact staff.'
      });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled' });
    }

    const fullReason = note ? `${reason} (${note})` : reason || 'Cancelled by Customer';

    order.status = 'Cancelled';
    order.cancellationReason = fullReason;
    order.cancelledBy = 'User';
    await order.save();

    // Release table if Dine-in
    if (order.orderType === 'Dine-in' && order.tableNumber) {
      const table = await Table.findOne({ number: order.tableNumber });
      if (table && table.currentOrderId?.toString() === order._id.toString()) {
        table.status = 'Available';
        table.currentOrderId = null;
        await table.save();
      }
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.menuItem');

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: populatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process Online Payment for order
// @route   POST /api/orders/:id/pay-online
// @access  Public
exports.payOnlineOrder = async (req, res) => {
  try {
    const { paymentMethod, upiId, cardNumber } = req.body;

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot pay for a cancelled order' });
    }

    order.paymentStatus = 'Paid';
    order.paymentMethod = paymentMethod || 'Online - UPI';
    order.transactionId = 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase() + Date.now().toString().substring(8);
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.menuItem');

    res.status(200).json({
      success: true,
      message: 'Payment received successfully',
      data: populatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin generate formal itemized bill/invoice
// @route   POST /api/orders/:id/generate-invoice
// @access  Private (Admin, Staff)
exports.generateOrderInvoice = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.invoiceNumber) {
      order.invoiceNumber = `INV-${new Date().getFullYear()}-${order._id.toString().substring(18).toUpperCase()}`;
      order.invoiceGeneratedAt = new Date();
    }

    // If subtotal and tax were not set, calculate now
    if (!order.subtotalAmount) {
      const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      order.subtotalAmount = subtotal;
      order.taxAmount = parseFloat((subtotal * 0.05).toFixed(2));
      order.totalAmount = parseFloat((subtotal + order.taxAmount).toFixed(2));
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Invoice generated and dispatched successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin/Staff)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin, Staff)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    if (status === 'Cancelled') {
      order.cancelledBy = 'Staff';
      if (cancellationReason) {
        order.cancellationReason = cancellationReason;
      }
    }

    await order.save();

    // If completed or cancelled, release the table status if Dine-in
    if ((status === 'Completed' || status === 'Cancelled') && order.orderType === 'Dine-in') {
      const table = await Table.findOne({ number: order.tableNumber });
      if (table && table.currentOrderId?.toString() === order._id.toString()) {
        table.status = 'Available';
        table.currentOrderId = null;
        await table.save();
      }
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.menuItem');

    res.status(200).json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order payment status (Admin/Staff)
// @route   PUT /api/orders/:id/payment
// @access  Private (Admin, Staff)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    const validStatuses = ['Unpaid', 'Paid'];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status' });
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    if (paymentMethod) {
      order.paymentMethod = paymentMethod;
    }
    if (paymentStatus === 'Paid' && !order.transactionId) {
      order.transactionId = 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase() + Date.now().toString().substring(8);
    }
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
