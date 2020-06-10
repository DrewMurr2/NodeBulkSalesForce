var axios = require('axios')
var jsforce = require('jsforce');

module.exports = async function login(username, password, token, url) {
    let conn = new jsforce.Connection({
        loginUrl: url
    });
	try{
		await conn.login(username, password + token);
		return conn;

	}catch(err){
		return null
	}

}