const mongoose = require('mongoose')
const express = require('express')
const Car = require('../models/car')
const {Company} = require('../models/company')
const router = express.Router()
const { check, validationResult } = require('express-validator')

// GET
router.get('/list', async (req, res) => {
    const cars = await Car
        .find()
        .populate('company', 'name country')
    res.send(cars)
})

router.get('/id/:id', async (req, res) => {
    const car = await Car.findById(req.params.id)
    if (!car) {
        res.status(404).send('There is no such thing as a car')
    } else {
        res.send(car)
    }
})

router.get('/:company', async (req, res) => {
    const car = await Car.find({ "company": req.params.company })
    if (!car) {
        res.status(404).send('There is no such car')
    } else {
        res.send(car)
    }
})

// POST
router.post('/create', [
    check('model').isLength({ min: 2 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const car = new Car({
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        available: req.body.available,
        price: req.body.price,
        extras: req.body.extras
    })
    const result = await car.save()
    res.status(201).send(car)
})

// PUT
router.put('/:id', [
    check('model').isLength({ min: 2 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const car = await Car.findByIdAndUpdate(req.params.id, {
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        available: req.body.available,
        price: req.body.price,
        extras: req.body.extras
    }, {
        new: true
    })
    if (!car) {
        return res.status(404).send('The car with that ID does not exist')
    }
    res.status(204).send(car)
})

// DELETE
router.delete('/delete/:id', async (req, res) => {
    const car = await Car.findByIdAndDelete(req.params.id)
    if (!car) {
        return res.status(404).send('The car with that ID does not exist and cannot be erased')
    }
    res.status(200).send('Car delete ok')
})

module.exports = router