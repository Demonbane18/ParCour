const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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