var axios = require('axios')
const SUCCESSFUL_RESULTS = 'successfulResults';
var csvtojson = require('csvtojson')

module.exports = async function getresult(options, jobId) {
	options.url =options.baseurl + jobId + '/' + SUCCESSFUL_RESULTS + '/';
	let result = {};
	try{
		let response = await axios.get(options.url, {headers:options.headers});
		await csvtojson().fromString(response.data).then((json)=>{result = json})
		return result
	}catch(err){
		return null;
	}        

}