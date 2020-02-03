const mongoose = require('mongoose')
const express = require('express')
const auth = require('../middleware/auth')
const Sale = require('../models/sale')
const User = require('../models/user')
const Car = require('../models/car')
const router = express.Router()
const { check, validationResult } = require('express-validator')

// GET
router.get('/list', async (req, res) => {
    const sales = await Sale
        .find()
        .populate('user')
        .populate('car')
    res.send(sales)
})

router.get('/id/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404).send('There is no user with that id')
    } else {
        res.send(user)
    }
})

// POST
router.post('/buy', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const user = await User.findById(req.body.userId)
    if (!user) return res.status(400).send('The user not exist')

    const car = await Car.findById(req.body.carId)
    if (!car) return res.status(400).send('The car not exist')

    if (car.available === false) return res.status(400).send('The car has already been sold')

    const sale = new Sale({
        user: req.body.userId,
        car: req.body.carId
    })

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const result = await sale.save()
        user.isCostumer = true
        user.save()
        car.available = false
        car.save()
        await session.commitTransaction()
        session.endSession()
        res.status(201).send(sale)
    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        res.status(500).send(err.message)
    }
})

// PUT
router.put('/:id', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const sale = await Sale.findByIdAndUpdate(req.params.id, {
        user: req.body.user,
        car: req.body.car
    }, {
        new: true
    })
    if (!sale) {
        return res.status(404).send('The sale with that ID does not exist')
    }
    res.status(204).send(sale)
})

// DELETE
router.delete('/delete/:id', async (req, res) => {
    const sale = await Sale.findByIdAndDelete(req.params.id)
    if (!sale) {
        return res.status(404).send('The sale with that ID does not exist and cannot be erased')
    }
    res.status(200).send('Sale delete ok')
})

module.exports = router