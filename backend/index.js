const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("your_mongodb_uri_here", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define a schema for storing RPM
const rpmSchema = new mongoose.Schema({
  rpm: { type: Number, required: true },
});
const RpmModel = mongoose.model("RPM", rpmSchema);

// Endpoint to get the current RPM
app.get("/get-rpm", async (req, res) => {
  try {
    const rpmData = await RpmModel.findOne();
    res.json({ rpm: rpmData ? rpmData.rpm : 0 });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching RPM data");
  }
});

// Endpoint to update the RPM
app.post("/update-rpm", async (req, res) => {
  const { rpm } = req.body;
  try {
    await RpmModel.updateOne({}, { rpm }, { upsert: true });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating RPM data");
  }
});

// Endpoint to get temperature and image URLs
app.get("/get-temperature-and-images", async (req, res) => {
  try {
    // Mock temperature and images
    const temperature = Math.floor(Math.random() * 100); // Random temperature between 0-99°C
    const images = [
      "https://via.placeholder.com/200?text=Motor+Image+1",
      "https://via.placeholder.com/200?text=Motor+Image+2",
      "https://via.placeholder.com/200?text=Motor+Image+3",
    ];
    res.json({ temperature, images });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching temperature and images");
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));









// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const motorRoutes = require('./routes/motorRoutes');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose
// .connect(process.env.MONGO_URI, {
//     serverSelectionTimeoutMS: 5000, // Optional: Set timeout for connection attempts
//     // secureProtocol: true,
//   })
// //   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => {
//     console.error('MongoDB connection error:');
//     // console.error('Error details:', err.stack);
//   });

// // Routes
// app.use('/api/motor', motorRoutes);

// // Server setup
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
