// server/services/externalApiService.js
import axios from 'axios';

// If your base URL needs https://, be sure to include it:
const BASE_URL = 'https://test.api.amadeus.com/v3'; 

async function getSpecificData() {
  try {
    // If you need a Bearer token from Amadeus, make sure you have it:
    const ACCESS_TOKEN = process.env.AMADEUS_ACCESS_TOKEN;

    const response = await axios.get(`${BASE_URL}/shopping/hotel-offers`, {
      // Pass your token in headers if required by the Amadeus API
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      // `params` becomes the query string:
      params: {
        hotelIds: 'MCLONGHM', // or for multiple IDs: 'MCLONGHM,ANOTHERID'
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

export default { getSpecificData };
