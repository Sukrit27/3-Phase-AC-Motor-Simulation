const express = require('express');
const router = express.Router();
const MotorData = require('../models/MotorData');

// Route: Get motor data by RPM
router.get('/:rpm', async (req, res) => {
  try {
    const rpm = parseInt(req.params.rpm);
    const data = await MotorData.findOne({ rpm });
    if (!data) {
      return res.status(404).json({ message: 'Data not found for the given RPM.' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Add new motor data
router.post('/', async (req, res) => {
  try {
    const newData = new MotorData(req.body);
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
