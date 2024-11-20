const mongoose = require('mongoose');

// Define the schema for motor data
const motorDataSchema = new mongoose.Schema({
  rpm: {
    type: Number,
    required: true,
    unique: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  otherResults: {
    type: String,
    required: true,
  },
  contourImages: {
    type: [String], // Array of image URLs
    required: true,
  },
});

// Export the model
const MotorData = mongoose.model('MotorData', motorDataSchema);
module.exports = MotorData;
