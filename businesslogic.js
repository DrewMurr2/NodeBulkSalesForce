var waitAsec = require('./waitAsec');
var axios = require('axios')
var csvtojson = require('csvtojson')

var jsforce = require('jsforce');

const SUCCESSFUL_RESULTS = 'successfulResults';
const JOB_COMPLETE = 'JobComplete';

module.exports = async (params) => {
    await waitAsec() //The only reason I put this in for the demo is because I know that in real life this function will be async and take some time

    console.log(params.csv_url)
    let csv_data;
    let options={};
    let jobId = 0;
    let result_data;
    let fields = [];
    let customObjectName = params.object_name + "__c";
    let accessToken;
    let baseUrl = process.env.SF_URL + 'services/data/v48.0/jobs/ingest/'
    let csvStream ='';
    let keys;
    let jsonParseData = [];

    let conn = new jsforce.Connection({
        loginUrl: process.env.SF_URL
    });
    let requestBody ={
        "object":customObjectName,
        "contentType":"CSV",
        "operation":"insert",
        "columnDelimiter":"SEMICOLON"
    }

    let login = async function(){ // login 
        try{
            await conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD + process.env.SF_TOKEN);
            accessToken = conn.accessToken
            console.log("Connected to salesforce: ",accessToken);
            await getCSVData()
    
        }catch(err){
            console.log("Disconnected to Saeslforce: ");
            return null
        }
    }

    let getCSVData = async function(){ // retrieve CSV data from Server

        try{
            let response = await axios.get(params.csv_url);
            console.log(response.data);
            await csvtojson().fromString(response.data).then((json)=>{csv_data = json})
            await modifyCSVFile()
    
        }catch(err){

        }
    }

    let modifyCSVFile = async function(){ // modify csv file to match for salesforce object rule

        for( var i = 0; i < csv_data.length; i++ ){
            var row = csv_data[i];
            let newRaw = {};
            newRaw["Name"] = i+1;
            Object.keys(row).map(item=>{
                newRaw[item+"__c"] = row[item];
            })
            jsonParseData.push(newRaw);
        }
        keys = Object.keys(jsonParseData[0]);
        for( var i = 0; i < keys.length-1; i++ ){
            csvStream +=keys[i] + ';';
        }
        csvStream += keys[keys.length-1];
        for( var i = 0; i < jsonParseData.length; i++ ){
            for( var j = 0; j < keys.length; j++ ){
                if( j == 0 ) csvStream +='\n';
                else csvStream += ';';
                csvStream += jsonParseData[i][keys[j]];
            }
        }
        console.log(csvStream);
      
        if( jsonParseData.length == 0 ){
            return {
                paramsReceived: params,
                time: new Date().toLocaleString()
            }
        }
    
        Object.keys(csv_data[0]).map(item=>{   // make salesforce custom objects fieldnames and property
            fields.push({
                fullName: customObjectName + "."+item + "__c",
                label: item,
                type: 'Text',
                length: 50,
                required:true,
                externalId:true
            })
            console.log(customObjectName + "."+item + "__c")
        });
        await conn.metadata.upsert('CustomField', fields)    // add custom fields with some 
        await createBatch()
    }
    let createBatch = async function() {  // Creating Batch
            console.log('creating job...');
            options ={
                headers:{
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type':'application/json; charset=UTF-8',
                    'Accept':'application/json'
                    },
                data: requestBody,
                url:baseUrl
            }

            try{
                let response = await axios.post(options.url, options.data,{
                    headers:options.headers
                });
                let data = response.data;
                jobId = data.id;
                if (jobId === undefined) {
                    console.log("jobId undefinded: ")
                } else {
                    console.log(jobId + ' job created');
                    await loadFile();
                }
            }catch(error){
                console.log("get job id error:", error)

            }


    };

    let loadFile =  async function() {  // upload CSV file to Job Batches
    
        options ={
            headers:{
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type':'text/csv',
                'Accept':'application/json'
                },
            data: csvStream,
            url:baseUrl + jobId + '/batches/'
        }

  
        try{
            let response = await axios.put(options.url, options.data, {headers:options.headers});
            await closeBatch()

        }catch(error){
            console.log("load error: ", error)
        }
    };

    let closeBatch = async function() { // Close Batch once uploading CSV

        options ={
            headers:{
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type':'application/json; charset=UTF-8',
                'Accept':'application/json'
                },
            data: {
                state: "UploadComplete"
            },
            url:baseUrl + jobId
        }
        try{
            let response = await axios.patch(options.url, options.data, {headers:options.headers});
            console.log("close Bath response: ")
            await getStatus();

        }catch(error){
                console.log("patch error: ", error);
        }
    
    };

    let getStatus = async function() {  // Scrope of job status
        options ={
            headers:{
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type':'application/json; charset=UTF-8',
                'Accept':'application/json'
                },
            url:baseUrl + jobId
        }

        try{
            let response = await axios.get(options.url, {headers:options.headers});
            console.log("get status values: ", response.data.state)
            if (response.data.state !== JOB_COMPLETE) {
                setTimeout(function() { getStatus() }, 2000);
            } else {
                await getResults(SUCCESSFUL_RESULTS);
            }
        }catch(err){

        }
    
   
    }
    let getResults = async function(which) {  // Get job results.
 
        options ={
            headers:{
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type':'application/json; charset=UTF-8',
                'Accept':'application/json'
                },
            url:baseUrl + jobId + '/' + which + '/'
        }

        try{
            let response = await axios.get(options.url, {headers:options.headers});
            console.log("get result values: ", response.data)
            result_data = response.data;
        }catch(err){

        }        
    }
    await login(); // start
    await waitAsec()
    //salesforce logout
    conn.logout();
    return {
        paramsReceived: params,
        result:result_data,
        time: new Date().toLocaleString()
    }
}