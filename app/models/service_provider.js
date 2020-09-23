const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceProviderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true,
        default: 'logo.png'
    }
}, {
    collection: 'service_providers'
})

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);