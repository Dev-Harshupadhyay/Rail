const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// 2. Root route to serve your index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 3. Dynamic Proxy Route for RapidAPI
app.get('/api/proxy/:version/:endpoint', async (req, res) => {
    const { version, endpoint } = req.params;
    const queryParams = new URLSearchParams(req.query).toString();
    
    // Use env variables
    const RAPID_API_KEY = process.env.RAPID_API_KEY;
    const RAPID_API_HOST = process.env.RAPID_API_HOST;

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
        console.error("Proxy Error:", err);
        res.status(500).json({ error: "Failed to connect to RailKit API" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`RailKit Server running on port ${PORT}`));
