require('dotenv').config()
var express = require('express');
var businesslogic = require('./businesslogic')
var app = express();

app.use(express.json());

app.post('/', async function (request, response) {
    let resultOfBusinessLogic = await businesslogic(request.body);
    response.json(resultOfBusinessLogic); // Send result of business logic back
});

app.listen(process.env.PORT, () => {
    console.log('Server listening on port: ', process.env.PORT)
});