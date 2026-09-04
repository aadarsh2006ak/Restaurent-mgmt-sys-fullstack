const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public
exports.getTables = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const tables = await Table.find(query).sort({ number: 1 });
    res.status(200).json({ success: true, count: tables.length, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new table
// @route   POST /api/tables
// @access  Private (Admin)
exports.createTable = async (req, res) => {
  try {
    const { number, capacity, status } = req.body;

    const existingTable = await Table.findOne({ number });
    if (existingTable) {
      return res.status(400).json({ success: false, message: 'Table already exists' });
    }

    const table = await Table.create({
      number,
      capacity,
      status: status || 'Available'
    });

    res.status(201).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update table details
// @route   PUT /api/tables/:id
// @access  Private (Admin, Staff)
exports.updateTable = async (req, res) => {
  try {
    let table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private (Admin)
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    await table.deleteOne();
    res.status(200).json({ success: true, message: 'Table deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
