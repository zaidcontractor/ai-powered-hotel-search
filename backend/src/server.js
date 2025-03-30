import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  console.log('[DEBUG] API Key:', process.env.AMADEUS_API_KEY ? "Loaded" : "Missing");
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Fetch hotels from Amadeus API
app.get('/api/hotels/:cityCode', async (req, res) => {
  const { cityCode } = req.params;
  const AMADEUS_API_URL = process.env.AMADEUS_API_URL;
  const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;

  if (!AMADEUS_API_URL || !AMADEUS_API_KEY) {
    return res.status(500).json({ error: "Missing Amadeus API configuration" });
  }

  try {
    const response = await axios.get(`${AMADEUS_API_URL}/v1/reference-data/locations/hotels/by-city`, {
      params: { cityCode },
      headers: { Authorization: `Bearer ${AMADEUS_API_KEY}` }
    });

    const hotels = response.data.data.map(hotel => ({
      name: hotel.name,
      latitude: hotel.geoCode.latitude,
      longitude: hotel.geoCode.longitude,
      address: hotel.address.lines.join(', '),
      matchPercentage: Math.floor(Math.random() * 100), 
      matches: ["Close to attractions", "Quiet area"], 
      nonMatches: ["No pool", "Limited parking"]
    }));

    res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to fetch hotel data" });
  }
});

// Root API documentation
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to HooHacks 2025 API',
    availableEndpoints: {
      '/api/health': 'Health check endpoint',
      '/api/hotels/:cityCode': 'Get hotels by city code (e.g., /api/hotels/NYC)'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    response: err.response?.data,
    status: err.response?.status
  });
  res.status(err.response?.status || 500).json({ error: err.message });
});

// Handle 404s
app.use((req, res) => {
  console.log('404 for:', req.method, req.url);
  res.status(404).json({ error: 'Not found' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hoohacks2025')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});