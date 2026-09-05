const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  addMenuItemReview
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getMenuItems)
  .post(protect, authorize('admin', 'staff'), createMenuItem);

router
  .route('/:id')
  .get(getMenuItemById)
  .put(protect, authorize('admin', 'staff'), updateMenuItem)
  .delete(protect, authorize('admin', 'staff'), deleteMenuItem);

// Rate & review a dish
router.post('/:id/rate', addMenuItemReview);

module.exports = router;
