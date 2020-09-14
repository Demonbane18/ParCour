const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true,
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
        default: 'supplier'
    }
}, {
    timestamps: true
}, {
    collection: 'users'
})

module.exports = mongoose.model('User', userSchema)