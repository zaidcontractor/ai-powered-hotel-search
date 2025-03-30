import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5001/api';

export const extractHotelPreferences = async (userQuery) => {
  try {
    const response = await axios.post(`${API_URL}/extract/preferences`, { userQuery });
    return response.data;
  } catch (error) {
    throw error;
  }
};