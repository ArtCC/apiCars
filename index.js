const mongoose = require('mongoose')
const express = require('express')
const app = express()
const car = require('./routes/carRoute')
const user = require('./routes/userRoute')
const company = require('./routes/companyRoute')
const sale = require('./routes/saleRoute')
const auth = require('./routes/authRoute')
app.use(express.json())
app.use('/api/cars/', car)
app.use('/api/users/', user)
app.use('/api/companies/', company)
app.use('/api/sales/', sale)
app.use('/api/auth/', auth)
const port = process.env.PORT || 3000
app.listen(port, () => console.log('Listening in port: ' + port))

mongoose.connect('mongodb://localhost/carsdb', { 
    useNewUrlParser: true, 
    useFindAndModify: false, 
    useUnifiedTopology: true,
    useCreateIndex: true })
    .then(() => console.log('Connected to MongoDb'))
    .catch(err => console.log('He hasn not connected to MongoDb: ' + err.message))