
var fs = require('fs')

module.exports = async function ObjectsSendtoSalesforce(connection, Object_name, file_name) {
    fs.readFile(file_name, 'utf8',(err, fileContent) => {
        if( err ) {
            console.log('Errors are:'+ err)
        } else {
            data = JSON.parse(fileContent.toString());
            var job =connection.bulk.createJob(Object_name, "insert");
            var batch = job.createBatch();
            batch.execute(data);
            batch.on("error", function(batchInfo) { console.log('Error, batchInfo:', batchInfo); });
            batch.on("queue", function(batchInfo) { 
                console.log('queue, batchInfo:', batchInfo);
                batch.poll(1000 /* interval(ms) */, 20000 /* timeout(ms) */); 
            });
            batch.on("response", function(responses) { 
                for (var i=0; i <responses.length; i++) {
                    if (responses[i].success) {
                        console.log("#" + (i+1) + ` loaded my data successfully, ${Object_name} id = ` +responses[i].id);
                    } else {
                        console.log("#" + (i+1) + ` error occurred in my data,  ${Object_name}message = ` +responses[i].errors.join(', '));
                    }
                 }
            });
        }
    })
}