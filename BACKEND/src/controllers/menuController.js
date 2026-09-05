const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res) => {
  try {
    const { category, cuisine, availableOnly } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (cuisine && cuisine !== 'All') {
      query.cuisine = cuisine;
    }

    if (availableOnly === 'true') {
      query.isAvailable = true;
    }

    const menuItems = await MenuItem.find(query);
    res.status(200).json({ success: true, count: menuItems.length, data: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private (Admin, Staff)
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, cuisine, imageUrl, isVeg, spiceLevel, isAvailable } = req.body;

    const existingItem = await MenuItem.findOne({ name });
    if (existingItem) {
      return res.status(400).json({ success: false, message: 'Menu item with this name already exists' });
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      cuisine: cuisine || 'Indian',
      imageUrl,
      isVeg: isVeg !== undefined ? isVeg : true,
      spiceLevel: spiceLevel || 'Medium',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      rating: 4.8,
      numReviews: 1
    });

    res.status(201).json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private (Admin, Staff)
exports.updateMenuItem = async (req, res) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private (Admin, Staff)
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    await menuItem.deleteOne();
    res.status(200).json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add rating and review to menu item
// @route   POST /api/menu/:id/rate
// @access  Public (Optional Customer Auth)
exports.addMenuItemReview = async (req, res) => {
  try {
    const { rating, comment, userName } = req.body;
    const ratingNum = Number(rating);

    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const nameToUse = (req.user && req.user.name) || userName || 'Valued Guest';

    const newReview = {
      user: req.user ? req.user._id : undefined,
      userName: nameToUse,
      rating: ratingNum,
      comment: comment || '',
      createdAt: new Date()
    };

    menuItem.reviews.push(newReview);

    // Calculate updated average
    const totalStars = menuItem.reviews.reduce((acc, item) => item.rating + acc, 0);
    menuItem.numReviews = menuItem.reviews.length;
    menuItem.rating = parseFloat((totalStars / menuItem.reviews.length).toFixed(1));

    await menuItem.save();

    res.status(200).json({
      success: true,
      message: 'Review submitted successfully',
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
