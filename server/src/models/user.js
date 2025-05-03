const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    guardian: {
        type: String,
        required: true
    },
    guardianContact: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)