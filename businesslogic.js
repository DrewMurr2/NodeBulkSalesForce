var waitAsec = require('./waitAsec')
var salesforceconnectionlogin = require('./login')

module.exports = async (params) => {
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
    return {
        paramsReceived: params,
        time: new Date().toLocaleString()
    }
}