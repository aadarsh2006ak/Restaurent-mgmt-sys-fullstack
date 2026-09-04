const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'restaurant_management_jwt_secret_key_super_secure_2026';

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Determine role (only admin/staff can create other admin/staff; public registration creates customers)
    let finalRole = 'customer';
    if (role && (role === 'admin' || role === 'staff')) {
      // If there are no users at all, let the first user be admin
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        finalRole = role;
      } else {
        // Require admin authorization if not the first user.
        // For simplicity, we can let user registration request role if they are testing,
        // or check authorization. Let's make it so that if a token is supplied and it's admin,
        // they can register staff/admin. Otherwise, override role to customer.
        let isAuthorizedCreator = false;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
          try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            const creator = await User.findById(decoded.id);
            if (creator && creator.role === 'admin') {
              isAuthorizedCreator = true;
            }
          } catch (e) {
            // ignore token error here and default to customer
          }
        }
        if (isAuthorizedCreator) {
          finalRole = role;
        } else {
          return res.status(403).json({ success: false, message: 'Only administrators can create staff or admin users' });
        }
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: finalRole
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed first admin user (helper for bootstrap)
// @route   POST /api/auth/seed-admin
// @access  Public
exports.seedAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin user already exists in the system' });
    }

    const user = await User.create({
      name: 'System Admin',
      email: 'admin@restaurant.com',
      password: 'AdminPassword123!',
      role: 'admin'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Admin account seeded successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
