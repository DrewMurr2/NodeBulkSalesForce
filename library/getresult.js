var axios = require('axios')
const SUCCESSFUL_RESULTS = 'successfulResults';

module.exports = async function getresult(options, jobId) {
	options.url =options.baseurl + jobId + '/' + SUCCESSFUL_RESULTS + '/';
	try{
		let response = await axios.get(options.url, {headers:options.headers});
		return response.data
	}catch(err){
		return null;
	}        

}