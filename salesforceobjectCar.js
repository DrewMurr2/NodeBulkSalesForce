var waitAsec = require('./waitAsec')
var salesforceconnectionlogin = require('./login')
var uploadJSONtoSalesforce= require('./uploadData')

module.exports = async function salesforce() {
    await waitAsec() 
    let connection = await salesforceconnectionlogin(); 
    var filenameforCars = './tests/test_objects/cars.json';
    var ObjectnameforCars = 'Car__c';
    await uploadJSONtoSalesforce(connection, ObjectnameforCars, filenameforCars ); 
}