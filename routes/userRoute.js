const mongoose = require('mongoose')
const express = require('express')
const User = require('../models/user')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

// GET
router.get('/list', async (req, res) => {
    const users = await User.find()
    res.send(users)
})

router.get('/id/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404).send('No tenemos ningún usuario con ese id')
    } else {
        res.send(user)
    }
})

router.get('/:name', async (req, res) => {
    const user = await User.find({ "name": req.params.name })
    if (!user) {
        res.status(404).send('No tenemos ningún usuario con ese nombre')
    } else {
        res.send(user)
    }
})

// POST
router.post('/create', [
    check('name').isLength({ min: 3 }),
    check('email').isEmail(),
    check('password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('El usuario ya existe')

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    user = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        isCostumer: false,
        email: req.body.email,
        password: hashPassword
    })
    const result = await user.save()
    res.status(201).send({
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email
    })
})

// PUT
router.put('/:id', [
    check('name').isLength({ min: 3 }),
    check('email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        lastname: req.body.lastname,
        isCostumer: req.body.isCostumer,
        email: req.body.email
    }, {
        new: true
    })
    if (!user) {
        return res.status(404).send('El usuario con ese ID no existe')
    }
    res.status(204).send(user)
})

// DELETE
router.delete('/delete/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
        return res.status(404).send('El usuario con ese ID no existe, no se puede borrar')
    }
    res.status(200).send('Usuario borrado')
})

module.exports = router