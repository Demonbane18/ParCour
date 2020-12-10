const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    tracking_id: {
      type: String,
      required: true,
      default: '0000 - 00000 - 0000',
    },
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    items: {
      type: Object,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    pickup_address: {
      type: String,
      required: true,
    },
    dropoff_address: {
      type: String,
      required: true,
    },
    payment_type: {
      type: String,
      required: true,
      default: 'COD',
    },
    service_provider: {
      type: String,
      required: true,
      default: 'MrSpeedy',
    },
    status: {
      type: String,
      required: true,
      default: 'order_placed',
    },
  },
  {
    timestamps: true,
  },
  {
    collection: 'orders',
  }
);

orderSchema.index({
  tracking_id: "text",
  company_name: "text",
  items: "text",
  name: "text",
  phone: "text",
  payment_type: "text",
  pickup_address: "text",
  dropoff_address: "text"
}, {
  weights: {
    tracking_id: 5,
    company_name: 4,
    items: 3,
    name: 2,
    phone: 1,
    payment_type: 1,
    pickup_address: 1,
    dropoff_address: 1
  },
});

module.exports = mongoose.model('Order', orderSchema);