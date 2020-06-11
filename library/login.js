var axios = require('axios')
var jsforce = require('jsforce');

var config = require('../config/config.json')

const SF_PASSWORD = config.Salesforce.password
const SF_USERNAME = config.Salesforce.username
const SF_URL = config.Salesforce.url
const SF_TOKEN = config.Salesforce.securityToken

module.exports = async function login() {
   let conn = new jsforce.Connection({
        loginUrl: SF_URL
    });
	try{
		await conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN);
		return conn;

	}catch(err){
		return null
	}

}