const mongoose = require('mongoose')
const express = require('express')
const app = express()
const car = require('./routes/carRoute')
const user = require('./routes/userRoute')
const company = require('./routes/companyRoute')
const sale = require('./routes/saleRoute')
const auth = require('./routes/auth')
app.use(express.json())
app.use('/api/cars/', car)
app.use('/api/users/', user)
app.use('/api/companies/', company)
app.use('/api/sales/', sale)
app.use('/api/auth/', auth)
const port = process.env.PORT || 3003
app.listen(port, () => console.log('Escuchando Puerto: ' + port))

mongoose.connect('mongodb://localhost/carsdb', { 
    useNewUrlParser: true, 
    useFindAndModify: false, 
    useUnifiedTopology: true,
    useCreateIndex: true })
    .then(() => console.log('Conectado a MongoDb'))
    .catch(err => console.log('No se ha conectado a MongoDb: ' + err.message))