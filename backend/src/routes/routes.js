// server/routes/dataRoutes.js
import { Router } from 'express';
import apiservice from "../services/externalApiService.js";

const router = Router();

// Update routes to include 'hotel' prefix
router.get('/hotel', async (req, res) => {
  try {
    const data = await apiservice.getMultiHotelOffers();
    res.send(data);
  } catch (error) {
    console.error('Error in GET /hotel:', error);
    res.status(500).send("An error occurred while fetching data.");
  }
});

router.get('/hotel/city/:cityCode', async (req, res) => {
  try {
    const { cityCode } = req.params;
    console.log('Received request for city:', cityCode);
    
    if (!cityCode || cityCode.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Invalid city code. Must be 3 letters (IATA code)'
      });
    }

    const data = await apiservice.getHotelsByCity(cityCode.toUpperCase());
    return res.json(data);
  } catch (error) {
    console.error('Route error:', error.response?.data || error);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: 'Error fetching hotels',
      error: error.message,
      details: error.response?.data
    });
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

export default router;
