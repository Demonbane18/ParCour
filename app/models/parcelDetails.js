const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parcelDetailSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  perishable: {
    type: Boolean,
    required: true,
    default: 0
  },
  weight: {
    type: String,
    required: true,
  }
}, {
  collection: 'parcelDetails'
});

module.exports = mongoose.model("ParcelDetails", parcelDetailsSchema);