const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// connect to MongoDB

mongoose.connect(process.env.MONGO_URI);

const lapSchema = new mongoose.Schema({
  loopNumber: Number,
  lapTime: String,
  timestamp: { type: Date, default: Date.now }
});

const Lap = mongoose.model('Lap', lapSchema);

// Save a lap
app.post('/api/lap', async (req, res) => {
  try {
    const { loopNumber, lapTime } = req.body;
    const lap = new Lap({ loopNumber, lapTime });
    await lap.save();
    res.status(201).json({ message: 'Lap saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save lap' });
  }
});

// Get all laps
app.get('/api/laps', async (req, res) => {
  try {
    const laps = await Lap.find().sort({ timestamp: -1 });
    res.json(laps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch laps' });
  }
});

const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
