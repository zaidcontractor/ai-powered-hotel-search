// server/services/externalApiService.js
import { get } from 'axios';

// Optionally, define your base URL
const BASE_URL = 'https://api.example.com'; // replace with the actual API base URL
const API_KEY = process.env.API_KEY;

async function getSpecificData(params) {
  try {
    // Append your API key to the request parameters
    const response = await get(`${BASE_URL}/desired-endpoint`, {
      params: { ...params, apiKey: API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

export default { getSpecificData };
