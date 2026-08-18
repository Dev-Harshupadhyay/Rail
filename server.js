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

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = process.env.RAPID_API_HOST;

// Generic proxy route: matches every call the frontend makes
// e.g. /api/proxy/v3/getPNRStatus?pnrNumber=1234567890
app.get('/api/proxy/:version/:endpoint', async (req, res) => {
  const { version, endpoint } = req.params;
  const url = `https://${RAPID_API_HOST}/api/${version}/${endpoint}`;

  try {
    const response = await axios.get(url, {
      params: req.query,
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });
    res.json(response.data);
  } catch (err) {
    console.error('Proxy error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: 'Failed to fetch from RailKit API',
      details: err.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`RailKit Server running on port ${PORT}`));
