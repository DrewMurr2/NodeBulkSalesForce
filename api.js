
const jsforce = require('jsforce');
require('dotenv').config();

const { SF_USERNAME, SF_PASSWORD, SF_TOKEN, SF_LOGIN_URL } = process.env;
if (!(SF_USERNAME && SF_PASSWORD && SF_TOKEN && SF_LOGIN_URL)) {
    console.error('missing mandatory configuration. Check your .env file.');
    process.exit(-1);
}
const conn = new jsforce.Connection();

conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, err => {
    if (err) {
        console.error(err);
        process.exit(-1);
    }
    conn.query('SELECT Id, Name FROM Account', function(err, accounts){
        if (err) {
            console.error(err);
            process.exit(-1);
        }
        console.log(accounts);
    });
    console.log('Heloooooooooooooooooooooooooooooo')
});
