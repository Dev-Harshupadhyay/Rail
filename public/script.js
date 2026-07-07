const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// RapidAPI Config
const RAPID_API_KEY = process.env.RAPID_API_KEY; 
const RAPID_API_HOST = 'irctc1.p.rapidapi.com';

// Dynamic Proxy Route
app.get('/api/proxy/:version/:endpoint', async (req, res) => {
    const { version, endpoint } = req.params;
    // URL ke saare query parameters (jaise trainNo, query, etc.) ko forward karo
    const queryParams = new URLSearchParams(req.query).toString();
    const url = `https://${RAPID_API_HOST}/api/${version}/${endpoint}?${queryParams}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': RAPID_API_HOST,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Proxy call failed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`RailKit Server running on port ${PORT}`));
