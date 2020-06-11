const request = require('request')
require('dotenv').config()
const port = process.env.PORT


module.exports = (object_name, object_array) => request.post('http://localhost:' + port, {
    json: {
        object_name,
        object_array
    }
}, (error, res, body) => {
    if (error) {
        console.error(error)
        return
    }
    console.log(`statusCode: ${res.statusCode}`)
    console.log(body)
})