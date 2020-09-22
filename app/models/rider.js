const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const riderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
        default: 'user.jpg'
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minimum: 8,
        maximum: 20
    },
    role: {
        type: String,
        default: 'rider'
    }
}, {
    timestamps: true
}, {
    collection: 'riders'
})

module.exports = mongoose.model('Rider', riderSchema)