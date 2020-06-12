require('dotenv').config()
var express = require('express');
var salesforcePeople = require('./salesforceobjectPeople')
var salesforceCar = require('./salesforceobjectCar')

var app = express();
app.use(express.json());

app.get('/', async function (request, response) {
    await salesforcePeople();
    await salesforceCar();
});

app.listen(process.env.PORT, () => {
    console.log('Server listening on port: ', process.env.PORT)
});