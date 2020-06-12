var waitAsec = require('./waitAsec')
var salesforceconnectionlogin = require('./login')
var uploadJSONtoSalesforce= require('./uploadData')

module.exports = async function salesforce() {
    await waitAsec() 
    let connection = await salesforceconnectionlogin(); 
    var filenameforPeople = './tests/test_objects/people.json';
    var ObjectnameforPeople = 'People__c';
    await uploadJSONtoSalesforce(connection, ObjectnameforPeople, filenameforPeople ); 
}