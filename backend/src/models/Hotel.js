import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  price: Number,
});

export default mongoose.model("Hotel", hotelSchema);