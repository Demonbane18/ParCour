const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parcelSchema = new Schema({
  vehicle_type: {
    type: String,
    required: true,
  },
  service_provider: {
    type: String,
    required: true,
    default: 'MrSpeedy'
  },
  image: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  parcelDetails: {
    type: Object,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  collection: 'parcel'
});

module.exports = mongoose.model("Parcel", parcelSchema);