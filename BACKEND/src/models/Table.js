const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, 'Please add table number'],
    unique: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Please add table capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Reserved'],
    default: 'Available'
  },
  currentOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  }
});

module.exports = mongoose.model('Table', tableSchema);
