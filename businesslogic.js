var waitAsec = require('./waitAsec');

var login = require('./library/login.js')
var getCSVFile = require('./library/getcsvfile.js')
var createBatch = require('./library/createbatch.js')
var loadFile = require('./library/loadfile.js')
var closeBatch = require('./library/closebatch.js')
var getStatus =require('./library/getstatus.js')
var getResult =require('./library/getresult.js')
var message = require('./library/message.js')

var config = require('./config/config.json')
module.exports = async (params) => {
    await waitAsec() //The only reason I put this in for the demo is because I know that in real life this function will be async and take some time

    let cObjName = params.object_name + "__c";
    let options = config.options;

    let connection = await login(); 

    if( connection == null )
        return message('Fail connecting to Salesforce App', params, connection)
    options.headers['Authorization'] = 'Bearer ' + connection.accessToken


    let csvStream = await getCSVFile(params.csv_url, connection, cObjName);
    if( csvStream == null )
        return message('Fail to get CSV', params, csvStream)

    let jobId = await createBatch(options, cObjName);

    if( jobId == null )
        return message('Fail to create Batch', params, jobId)

    let isLoaded = await loadFile(options, jobId, csvStream);
    if( !isLoaded )
        return message('Fail to upload CSV', params, isLoaded)
    
    let isClosed = await closeBatch(options, jobId);
    if( !isClosed )
        return message('Fail to close Batch', params, isClosed);

    while( await getStatus(options, jobId) == false ){
        await waitAsec();
    }
    let result = await getResult(options, jobId)
    connection.logout();
    return message('Success', params, result)
 
}