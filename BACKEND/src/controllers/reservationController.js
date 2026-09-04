const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Public
exports.createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, time, partySize } = req.body;

    if (!name || !email || !phone || !date || !time || !partySize) {
      return res.status(400).json({ success: false, message: 'Please provide all details' });
    }

    const reservation = await Reservation.create({
      name,
      email,
      phone,
      date,
      time,
      partySize
    });

    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private (Admin, Staff)
exports.getReservations = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const reservations = await Reservation.find(query).sort({ date: 1, time: 1 });
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update reservation status / Assign table
// @route   PUT /api/reservations/:id
// @access  Private (Admin, Staff)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status, tableNumber } = req.body;
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (status) {
      reservation.status = status;
    }

    if (tableNumber !== undefined) {
      reservation.tableNumber = tableNumber;

      // If assigning table and confirmed, mark the table as Reserved
      if (tableNumber && status === 'Confirmed') {
        const table = await Table.findOne({ number: tableNumber });
        if (table) {
          table.status = 'Reserved';
          await table.save();
        }
      }
    }

    await reservation.save();
    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
