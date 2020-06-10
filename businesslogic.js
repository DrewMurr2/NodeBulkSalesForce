var waitAsec = require('./waitAsec');

var login = require('./library/login.js')
var getCSVFile = require('./library/getcsvfile.js')
var createBatch = require('./library/createbatch.js')
var loadFile = require('./library/loadfile.js')
var closeBatch = require('./library/closebatch.js')
var getStatus =require('./library/getstatus.js')
var getResult =require('./library/getresult.js')
var message = require('./library/message.js')

const SF_PASSWORD = process.env.SF_PASSWORD
const SF_USERNAME = process.env.SF_USERNAME
const SF_URL = process.env.SF_URL
const SF_TOKEN = process.env.SF_TOKEN
const BASE_URL = process.env.SF_URL + 'services/data/v48.0/jobs/ingest/'

module.exports = async (params) => {
    await waitAsec() //The only reason I put this in for the demo is because I know that in real life this function will be async and take some time

    console.log(params.csv_url)
    let cObjName = params.object_name + "__c";
    let requestBody ={
        "object":cObjName,
        "contentType":"CSV",
        "operation":"insert",
        "columnDelimiter":"SEMICOLON"
    }
    let options={
        headers:{
            'Authorization': 'Bearer ',
            'Content-Type':'application/json; charset=UTF-8',
            'Accept':'application/json'
            },
        data: requestBody,
        url:BASE_URL,
        baseurl: BASE_URL
    }

    let connection = await login(SF_USERNAME,SF_PASSWORD,SF_TOKEN, SF_URL); 

    if( connection == null )
        return message('Fail connecting to Salesforce App', params, connection)
    options.headers['Authorization'] = 'Bearer ' + connection.accessToken

    let csvStream = await getCSVFile(params.csv_url, connection, cObjName);
    if( csvStream == null )
        return message('Fail to get CSV', params, csvStream)

    let jobId = await createBatch(options);

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