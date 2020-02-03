const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const role = require('../helpers/role')

const userSchema = new mongoose.Schema({
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
    role: String,
    date: { type: Date, default: Date.now }
})

userSchema.methods.generateJWT = function () {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        role: this.role
    },
        process.env.SECRET_KEY_JWT_API_CARS)
}

const User = mongoose.model('user', userSchema)

module.exports = User