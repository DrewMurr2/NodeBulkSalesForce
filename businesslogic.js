var waitAsec = require('./waitAsec')
var salesforceconnectionlogin = require('./login')

module.exports = async (params) => {
    await waitAsec() //The only reason I put this in for the demo is because I know that in real life this function will be async and take some time
    let connection = await salesforceconnectionlogin(); 
    console.log("Access Token is:" + connection.accessToken)
    //object_array [{},{}]
    //object_name cars
    var job =connection.bulk.createJob(params.object_name, "insert");
    var batch = job.createBatch();
    batch.execute(params.object_array);
    batch.on("error", function(batchInfo) { console.log('Error, batchInfo:', batchInfo); });
    batch.on("queue", function(batchInfo) { 
        console.log('queue, batchInfo:', batchInfo);
        batch.poll(1000 /* interval(ms) */, 20000 /* timeout(ms) */); 
    });
    batch.on("response", function(responses) { 
        for (var i=0; i <responses.length; i++) {
                if (responses[i].success) {
                console.log("#" + (i+1) + ` loaded my data successfully, ${params.object_name} id = ` +responses[i].id);
                } else {
                console.log("#" + (i+1) + ` error occurred in my data,  ${params.object_name}message = ` +responses[i].errors.join(', '));
            }
         }
    });
    return {
        paramsReceived: params,
        time: new Date().toLocaleString()
    }
}