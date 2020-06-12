var waitAsec = require('./waitAsec')
var salesforceconnectionlogin = require('./login')

module.exports = async (params) => {
<<<<<<< HEAD
    await waitAsec() 
    let connection = await salesforceconnectionlogin(); 
    console.log("Access Token is:" + connection.accessToken)
    var filename = "./CSVs/" + params.csv_url; 
    var csvFileIn = require('fs').createReadStream(filename);
    connection.bulk.load(params.object_name, "insert", csvFileIn, function(err, response) {
        if (err) { return console.error(err); }
        for (var i=0; i < response.length; i++) {
            if (response[i].success) {
                console.log("#" + (i+1) + `loaded successfully into ${params.object_name} object, id =`  + response[i].id);
            } else {
                console.log("#" + (i+1) +  `error occurred in ${params.object_name} object, message = ` + response[i].errors.join(', '));
            }
        }
    });
=======
    await waitAsec() //The only reason I put this in for the demo is because I know that in real life this function will be async and take some time
    console.log(params)
    //object_array [{},{}]
    //object_name cars

>>>>>>> 8031ac3e0197e7620e80aa6b67c0d3cc5a0e68a5
    return {
        paramsReceived: params,
        time: new Date().toLocaleString()
    }
}