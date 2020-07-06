const jsforce = require('jsforce');
require('dotenv').config();
const { SF_USERNAME, SF_PASSWORD, SF_TOKEN, SF_LOGIN_URL } = process.env;
module.exports = async function login() {
    let conn = new jsforce.Connection({
        loginUrl: SF_LOGIN_URL
    });
	try{
		await conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN);
		return conn;
	}catch(err){ return null }
}