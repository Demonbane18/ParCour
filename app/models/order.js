const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    tracking_id: {
        type: String,
        required: true,
        default: '0000 - 00000 - 0000'
    },
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    items: {
        type: Object,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    pickup_address: {
        type: String,
        required: true
    },
    dropoff_address: {
        type: String,
        required: true
    },
    payment_type: {
        type: String,
        required: true,
        default: 'COD',
    },
    status: {
        type: String,
        required: true,
        default: 'order_placed'
    }
}, {
    timestamps: true
}, {
    collection: 'orders'
})

module.exports = mongoose.model('Order', orderSchema);