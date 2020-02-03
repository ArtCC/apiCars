const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const router = express.Router()
const { check, validationResult } = require('express-validator')

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

    const token = jwt.sign({
        _id: user._id,
        name: user.name,
        'createAt': Date.now
      },
      'yBph?=6gT2J7Tnn%g&32Sdr$')

    res.status(200).send({'token': token})
})

module.exports = router