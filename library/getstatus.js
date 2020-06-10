var axios = require('axios')
const JOB_COMPLETE = 'JobComplete';

module.exports = async function getstatus(options, jobId) {
	options.headers['Content-Type'] = 'application/json; charset=UTF-8';
	options.url = options.baseurl+ jobId;
	try{
		let response = await axios.get(options.url, {headers:options.headers});
		return (response.data.state !== JOB_COMPLETE) ? false : true
	}catch(err){
		return false;
	}
	
}