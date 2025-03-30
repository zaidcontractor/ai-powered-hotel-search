// server/routes/dataRoutes.js
import { Router } from "express";
import apiservice from "../services/externalApiService.js";
import Hotel from "../models/Hotel.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await apiservice.getMultiHotelOffers();
    res.send(data);
  } catch (error) {
    console.error("Error in GET /:", error);
    res.status(500).send("An error occurred while fetching data.");
  }
});

router.post("/add", async (req, res) => {
  try {
    const { name, location, price } = req.body;
    const newHotel = new Hotel({ name, location, price });
    await newHotel.save();
    res.json({ message: "Hotel added successfully!", hotel: newHotel });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding hotel", details: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching hotels", details: error.message });
  }
});

router.delete("/remove/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHotel = await Hotel.findByIdAndDelete(id);
    if (!deletedHotel)
      return res.status(404).json({ message: "Hotel not found" });
    res.json({ message: "Hotel removed successfully!", hotel: deletedHotel });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error removing hotel", details: error.message });
  }
});

export default router;
