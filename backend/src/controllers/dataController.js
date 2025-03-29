// server/controllers/dataController.js
import { getSpecificData } from '../services/externalApiService';

async function fetchData(req, res) {
  try {
    // Extract any query parameters or request data as needed
    const params = req.query;
    const data = await getSpecificData(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}

export default { fetchData };
