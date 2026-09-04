const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Sides', 'Indian', 'Chinese']
  },
  cuisine: {
    type: String,
    enum: ['Indian', 'Chinese', 'Continental', 'Fusion'],
    default: 'Indian'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  spiceLevel: {
    type: String,
    enum: ['Mild', 'Medium', 'Spicy', 'None'],
    default: 'Medium'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
