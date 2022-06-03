const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'supplier'
    },
    company_name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true,
        minimum: 8,
        maximum: 20
    },
    token: {
        type: String,
        required: false
    },
    is_verified: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true
}, {
    collection: 'users'
})
userSchema.index({
    company_name: "text",
    name: "text",

},
{
    weights: {
      company_name: 10,
      name: 5
    },
},{ default_language: "none" }
);

module.exports = mongoose.model('User', userSchema)