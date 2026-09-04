const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservations,
  updateReservationStatus
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(createReservation)
  .get(protect, authorize('admin', 'staff'), getReservations);

router.route('/:id').put(protect, authorize('admin', 'staff'), updateReservationStatus);

module.exports = router;
