const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parcelSchema = new Schema(
  {
    vehicle_type: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { collection: "parcel" }
);

module.exports = mongoose.model("Parcel", parcelSchema);