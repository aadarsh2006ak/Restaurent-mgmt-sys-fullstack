const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add guest name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add guest email'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please add guest contact phone']
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: [true, 'Please add reservation date']
  },
  time: {
    type: String, // format HH:MM
    required: [true, 'Please add reservation time']
  },
  partySize: {
    type: Number,
    required: [true, 'Please add party size'],
    min: 1
  },
  tableNumber: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
