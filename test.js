require('dotenv').config()
var express = require('express');
var getObjects = require('./getObjects')
var app = express();

app.listen(process.env.PORT, () => {
    var allobjects = getObjects();
    console.log('Server listening on port: ', process.env.PORT)
});
