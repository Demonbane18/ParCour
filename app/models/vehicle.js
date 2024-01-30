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

vehicleSchema.index({
    plate_number: "text",
    car_model: "text",
    brand: "text",
    vehicle_type: "text",
    color: "text"
}, {
    weights: {
        plate_number: 5,
        car_model: 4,
        brand: 3,
        vehicle_type: 2,
        color: 1,
    },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);