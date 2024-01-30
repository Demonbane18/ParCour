const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceProviderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
}, {
    collection: 'service_providers'
})

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);