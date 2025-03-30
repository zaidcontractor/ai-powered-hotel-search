import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import route from './routes/routes.js';

// Your additional code here


const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Add health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use("/api/hotel", route);  // Update the route path to include /api

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hoohacks2025')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
