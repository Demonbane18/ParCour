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
    license: {
        type: String,
        required: true,
        unique: true,
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

    role: {
        type: String,
        default: 'rider'
    }
}, {
    timestamps: true
}, {
    collection: 'riders'
})

riderSchema.index({
    name: "text",
    license: "text"

},
{
    weights: {
      name: 5,
      license: 3,
    },
},{ default_language: "none" }
);

module.exports = mongoose.model('Rider', riderSchema)