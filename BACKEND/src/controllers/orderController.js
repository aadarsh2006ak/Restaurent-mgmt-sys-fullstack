const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Optional Customer Auth)
exports.createOrder = async (req, res) => {
  try {
    const { items, tableNumber, orderType, guestName } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // Verify items and compute total amount using current database prices
    let computedItems = [];
    let totalAmount = 0;

    for (let item of items) {
      const dbMenuItem = await MenuItem.findById(item.menuItem);
      if (!dbMenuItem) {
        return res.status(404).json({ success: false, message: `Menu item not found: ${item.menuItem}` });
      }
      if (!dbMenuItem.isAvailable) {
        return res.status(400).json({ success: false, message: `Item ${dbMenuItem.name} is currently unavailable` });
      }

      const itemTotal = dbMenuItem.price * item.quantity;
      totalAmount += itemTotal;

      computedItems.push({
        menuItem: dbMenuItem._id,
        quantity: item.quantity,
        price: dbMenuItem.price
      });
    }

    // Prepare order details
    const orderData = {
      items: computedItems,
      totalAmount,
      orderType: orderType || 'Dine-in'
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

// @desc    Get all orders (Admin/Staff)
// @route   GET /api/orders
// @access  Private (Admin, Staff)
exports.getOrders = async (req, res) => {
  try {
    const { status, limit } = req.query;
    let query = {};

    if (status) {
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

// @desc    Update order status (Admin/Staff)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin, Staff)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
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
    const { paymentStatus } = req.body;
    const validStatuses = ['Unpaid', 'Paid'];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status' });
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
