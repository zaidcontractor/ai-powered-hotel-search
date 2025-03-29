// server/services/externalApiService.js
import axios from 'axios';

// If your base URL needs https://, be sure to include it: 

async function getMultiHotelOffers() {
  const BASE_URL = 'https://test.api.amadeus.com/v3';
  try {
    // If you need a Bearer token from Amadeus, make sure you have it:
    const ACCESS_TOKEN = process.env.TOKEN2;

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

async function getHotelsByCity() {
  const BASE_URL = 'https://test.api.amadeus.com/v1';
  try {
    // If you need a Bearer token from Amadeus, make sure you have it:
    const ACCESS_TOKEN = process.env.TOKEN2;

    const response = await axios.get(`${BASE_URL}/reference-data/locations/hotels/by-city`, {
      // Pass your token in headers if required by the Amadeus API
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      // `params` becomes the query string:
      params: {
        cityCode: 'PAR', // or for multiple IDs: 'MCLONGHM,ANOTHERID'
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}


export default { getMultiHotelOffers, getHotelsByCity};
