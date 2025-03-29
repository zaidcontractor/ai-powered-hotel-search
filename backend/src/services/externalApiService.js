// server/services/externalApiService.js
import axios from 'axios';

// Optionally, define your base URL
const BASE_URL = 'https://api.example.com'; // replace with the actual API base URL
const API_KEY = process.env.API_KEY;

async function getSpecificData() {
  try {
    const response = await axios.get(`${BASE_URL}/shopping/hotel-offers`, {
      params: {hotelIds:["MCLONGHM"], apiKey: API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

export default { getSpecificData };
