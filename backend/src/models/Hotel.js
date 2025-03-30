import mongoose from "mongoose";

const { Schema } = mongoose;

const hotelSchema = new Schema(
  {
    chainCode: {
      type: String,
      required: true,
    },
    iataCode: {
      type: String,
      required: true,
    },
    dupeId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    hotelId: {
      type: String,
      required: true,
      unique: true,
    },
    geoCode: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    address: {
      countryCode: {
        type: String,
        required: true,
      },
    },
    lastUpdate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
