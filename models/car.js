const mongoose = require('mongoose')
const {companySchema} = require('./company')

const carSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    model: String,
    available: Boolean,
    price: {
        type: Number,
        required: function () {
            return this.available
        }
    },
    year: {
        type: Number,
        required: true,
        min: 2000,
        max: 2020
    },
    extras: [String],
    date: { type: Date, default: Date.now }
})

const Car = mongoose.model('car', carSchema)

module.exports = Car