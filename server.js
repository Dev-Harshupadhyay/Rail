require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const API_HOST = process.env.RAPIDAPI_HOST;
const API_KEY = process.env.RAPIDAPI_KEY;

const rapidHeaders = {
  'Content-Type': 'application/json',
  'x-rapidapi-host': API_HOST,
  'x-rapidapi-key': API_KEY
};

// Helper function - repeat code kam karne ke liye
async function callIrctc(path, params, res) {
  try {
    const response = await axios.get(`https://${API_HOST}${path}`, {
      headers: rapidHeaders,
      params
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: 'API call failed',
      details: err.response?.data || err.message
    });
  }
}

// 1. Search Train (by number/name)
app.get('/api/search-train', (req, res) => {
  callIrctc('/api/v1/searchTrain', { query: req.query.query }, res);
});

// 2. Trains Between Stations
app.get('/api/trains-between', (req, res) => {
  const { fromStationCode, toStationCode } = req.query;
  callIrctc('/api/v3/trainBetweenStations', { fromStationCode, toStationCode }, res);
});

// 3. Live Train Status
app.get('/api/live-status', (req, res) => {
  const { trainNo, startDay } = req.query;
  callIrctc('/api/v1/liveTrainStatus', { trainNo, startDay: startDay || 1 }, res);
});

// 4. PNR Status
app.get('/api/pnr-status', (req, res) => {
  callIrctc('/api/v3/getPNRStatus', { pnrNumber: req.query.pnrNumber }, res);
});

// 5. Train Classes (available seat classes)
app.get('/api/train-classes', (req, res) => {
  callIrctc('/api/v1/getTrainClasses', { trainNo: req.query.trainNo }, res);
});

// 6. Trains by Station
app.get('/api/trains-by-station', (req, res) => {
  callIrctc('/api/v3/getTrainsByStation', { stationCode: req.query.stationCode }, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chal raha hai: http://localhost:${PORT}`));
