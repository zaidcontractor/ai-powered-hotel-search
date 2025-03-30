import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import route from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Add debug logging
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  console.log('[DEBUG] API Key:', process.env.API_KEY);
  next();
});

// Move API routes first and update the base path
app.use("/api", route);  // Changed from "/api/hotel" to "/api"

// Update root API route to be more specific
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to HooHacks 2025 API',
    availableEndpoints: {
      '/api': 'This documentation',
      '/api/health': 'Health check endpoint',
      '/api/hotel': 'Get hotel offers (default test data)',
      '/api/hotel/test': 'Get filtered hotel offers for NYC',
      '/api/hotel/city/:cityCode': 'Get hotels by city code (e.g., /api/hotel/city/NYC)'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to HooHacks 2025 API',
    availableEndpoints: {
      '/': 'This documentation',
      '/api/health': 'Health check endpoint',
      '/api/hotel': 'Get hotel offers (default test data)',
      '/api/hotel/test': 'Get filtered hotel offers for NYC',
      '/api/hotel/city/:cityCode': 'Get hotels by city code (e.g., /api/hotel/city/NYC)'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware - update to show more details
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    response: err.response?.data,
    status: err.response?.status,
    config: {
      url: err.config?.url,
      headers: err.config?.headers
    }
  });
  res.status(err.response?.status || 500).json({ 
    error: err.message,
    details: err.response?.data
  });
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
