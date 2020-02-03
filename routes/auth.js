const mongoose = require('mongoose')
const express = require('express')
const User = require('../models/user')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

// POST
router.post('/login', [
    check('email').isEmail(),
    check('password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send('Usuario o contraseña incorrecto')
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Usuario o contraseña incorrecto')
    res.status(200).send({
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        isCostumer: user.isCostumer
    })
})

module.exports = router