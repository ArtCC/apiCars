const mongoose = require('mongoose')
const express = require('express')
const auth = require('../middleware/auth')
const authorize = require('../middleware/role')
const role = require('../helpers/role')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const router = express.Router()
const { check, validationResult } = require('express-validator')

/**
 * GET request
 */
router.get('/', async (req, res) => {
    res.status(200).send('Hello World!')
})

router.get('/list', [auth, authorize([role.Admin])], async (req, res) => {
    const users = await User.find()
    res.send(users)
})

router.get('/id/:id', [auth, authorize([role.Admin])], async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404).send('There is no user with that id')
    } else {
        res.send(user)
    }
})

router.get('/:name', [auth, authorize([role.Admin])], async (req, res) => {
    const user = await User.find({ "name": req.params.name })
    if (!user) {
        res.status(404).send('There is no user with that name')
    } else {
        res.send(user)
    }
})

/**
 * POST request
 */
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
    if (user) return res.status(400).send('The user already exists')

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    user = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        isCostumer: false,
        email: req.body.email,
        password: hashPassword,
        role: req.body.role
    })
    const result = await user.save()
    const token = user.generateJWT()
    res.status(201).header('Authorization', token).send({
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email
    })
})

/**
 * PUT request
 */
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
        return res.status(404).send('The user with that ID does not exist')
    }
    res.status(204).send(user)
})

/**
 * DELETE request
 */
router.delete('/delete/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
        return res.status(404).send('The user with that ID does not exist and cannot be erased')
    }
    res.status(200).send('User delete ok')
})

module.exports = router