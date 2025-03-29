// server/routes/dataRoutes.js
import { Router } from 'express';
import apiservice from "../services/externalApiService.js";

const router = Router();

// Define a GET endpoint for retrieving the external API data
router.get('/', async (req, res) => {
  try {
    const data = await apiservice.getMultiHotelOffers();
    res.send(data);
  } catch (error) {
    console.error('Error in GET /:', error);
    res.status(500).send("An error occurred while fetching data.");
  }
});

export default router;
