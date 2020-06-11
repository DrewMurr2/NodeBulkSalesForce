var axios = require('axios')

module.exports = async function loadfile(options, jobId, csvStream) {
	options.headers['Content-Type'] = 'text/csv';
	options.data = csvStream;
	options.url = options.baseurl + jobId + '/batches/';
	try{
		await axios.put(options.url, options.data, {headers:options.headers});
		return true;

	}catch(error){
		return false;

	}

}