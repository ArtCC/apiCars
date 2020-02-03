const mongoose = require('mongoose')

const saleSchema = new mongoose.Schema( {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'car',
        require: true
    },
    date: { type: Date, default: Date.now }
})

const Sale = mongoose.model('sale', saleSchema)

module.exports = Sale