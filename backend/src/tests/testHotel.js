import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";

const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/hoohacks2025";

// connect to mongodb
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

(async () => {
  try {
    console.log("Starting Hotel model tests...");

    // create a new hotel document
    const newHotel = new Hotel({
      chainCode: "AL",
      iataCode: "RIC",
      dupeId: 700102155,
      name: "ALOFT RICHMOND WEST",
      hotelId: "ALRIC139",
      geoCode: {
        latitude: 37.6473,
        longitude: -77.602,
      },
      address: {
        countryCode: "US",
      },
      lastUpdate: new Date("2024-08-12T06:05:15"),
    });

    const savedHotel = await newHotel.save();
    console.log("Hotel created successfully:", savedHotel);

    // retrieve the hotel document by hotelId
    const foundHotel = await Hotel.findOne({ hotelId: "ALRIC139" });
    console.log("Hotel retrieved successfully:", foundHotel);

    // delete the hotel document by hotelId
    await Hotel.deleteOne({ hotelId: "ALRIC139" });
    console.log("Hotel deleted successfully");

    // close the database connection
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error during Hotel model tests:", error.message);
    mongoose.connection.close(); // Ensure connection is closed on error
  }
})();
