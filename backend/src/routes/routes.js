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

// Add new test endpoint
router.get('/test', async (req, res) => {
  try {
    const testParams = {
      IATACityCode: "NYC",
      amenities: ["SWIMMING_POOL", "WIFI"],
      ratings: "5",
      checkInDate: "2024-03-25",
      checkOutDate: "2024-03-30",
      numRooms: 2,
      guestCount: 4,
      roomCapacity: 4,
      perNightPriceLow: 250,
      perNightPriceHigh: 500,
      guestRelationship: "FAMILY",
      boardType: "ROOM_ONLY",
      hotelSource: "OTHER",
      accessibilityNeeds: []
    };

    const result = await apiservice.getHotelOffersWithFilters(testParams);
    res.json(result.hotels);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotel data',
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

router.get('/city/:cityCode', async (req, res) => {
  try {
    const { cityCode } = req.params;
    const data = await apiservice.getHotelsByCity(cityCode);
    res.json({
      success: true,
      message: `Hotels found in ${cityCode}`,
      data: data
    });
  } catch (error) {
    console.error('Error in GET /city/:cityCode:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotels',
      error: error.message
    });
  }
});

export default router;
