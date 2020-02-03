const mongoose = require('mongoose')
const express = require('express')
const {Company} = require('../models/company')
const router = express.Router()
const { check, validationResult } = require('express-validator')

// GET
router.get('/list', async (req, res) => {
    const companies = await Company.find()
    res.send(companies)
})

router.get('/id/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404).send('There is no company with that id')
    } else {
        res.send(user)
    }
})

router.get('/:name', async (req, res) => {
    const user = await User.find({ "name": req.params.name })
    if (!user) {
        res.status(404).send('There is no company with that name')
    } else {
        res.send(user)
    }
})

// POST
router.post('/create', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const company = new Company({
        name: req.body.name,
        country: req.body.country
    })
    const result = await company.save()
    res.status(201).send(company)
})

// PUT
router.put('/:id', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const company = await Company.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        country: req.body.country
    }, {
        new: true
    })
    if (!company) {
        return res.status(404).send('The company with that ID does not exist')
    }
    res.status(204).send(company)
})

// DELETE
router.delete('/delete/:id', async (req, res) => {
    const company = await Company.findByIdAndDelete(req.params.id)
    if (!company) {
        return res.status(404).send('The company with that ID does not exist and cannot be erased')
    }
    res.status(200).send('Company delete ok')
})

module.exports = router