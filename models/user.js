const mongoose = require('mongoose')

const userShema = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    isCostumer: Boolean,
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    date: { type: Date, default: Date.now }
})

const User = mongoose.model('user', userShema)

module.exports = User