const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
// const connectDB = require('./config/db');

const app = express();

// Connect to Database
// connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/extract', require('./routes/aiExtraction'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));