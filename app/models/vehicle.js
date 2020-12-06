const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    vehicle_type: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    car_model: {
        type: String,
        required: true,
    },
    plate_number: {
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
    }
}, {
    collection: 'vehicles'
});

module.exports = mongoose.model("Vehicle", vehicleSchema);