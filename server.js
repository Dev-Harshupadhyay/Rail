require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---- RapidAPI config (never hardcode the key — set these in your host's
// environment variables / .env file) ----
const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = process.env.RAPID_API_HOST || 'irctc-indian-railway-pnr-status.p.rapidapi.com';
const BASE_URL = `https://${RAPID_API_HOST}`;

if (!RAPID_API_KEY) {
  console.warn('[RailKit] WARNING: RAPID_API_KEY is not set. Set it in your .env or host env vars.');
}

const rapidHeaders = {
  'x-rapidapi-key': RAPID_API_KEY,
  'x-rapidapi-host': RAPID_API_HOST,
  'Content-Type': 'application/json'
};

// Small helper so every route shares the same request/error handling
async function proxyGet(res, url, params) {
  try {
    const response = await axios.get(url, {
      params,
      headers: rapidHeaders,
      timeout: 10000
    });
    res.json(response.data);
  } catch (err) {
    console.error('RailKit proxy error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: 'Failed to fetch from RailKit API',
      details: err.response?.data || err.message
    });
  }
}

// 1. PNR status -> GET /getPNRStatus/{pnr}
app.get('/api/pnr/:pnr', (req, res) => {
  proxyGet(res, `${BASE_URL}/getPNRStatus/${encodeURIComponent(req.params.pnr)}`);
});

// 2. Fare -> GET /fare?adults=&from=&to=&class=&children=&quota=
app.get('/api/fare', (req, res) => {
  const { adults, from, to, class: travelClass, children, quota } = req.query;
  proxyGet(res, `${BASE_URL}/fare`, {
    adults: adults ?? 1,
    from,
    to,
    class: travelClass,
    children: children ?? 0,
    quota: quota ?? 'GN'
  });
});

// 3. Station info -> GET /station/{stationCode}
app.get('/api/station/:code', (req, res) => {
  proxyGet(res, `${BASE_URL}/station/${encodeURIComponent(req.params.code)}`);
});

// 4. Live train status -> GET /live-train/{trainNo}/status
app.get('/api/live-train/:trainNo', (req, res) => {
  proxyGet(res, `${BASE_URL}/live-train/${encodeURIComponent(req.params.trainNo)}/status`);
});

// 5. Train info -> GET /train/{trainNo}
app.get('/api/train/:trainNo', (req, res) => {
  proxyGet(res, `${BASE_URL}/train/${encodeURIComponent(req.params.trainNo)}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`RailKit Server running on port ${PORT}`));
