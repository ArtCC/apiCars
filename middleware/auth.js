const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    const token = req.header('Authorization')
    if (!token) return res.status(401).send('Access denied. Token is empty')
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY_JWT_API_CARS)
        req.user = payload
        next()
    } catch (err) {
        res.status(400).send('Access denied. Token invalid')
    }
}

module.exports = auth