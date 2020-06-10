var axios = require('axios')

module.exports = async function closebatch(options, jobId) {

	options.headers['Content-Type'] = 'application/json; charset=UTF-8';
	options.data = {
		state: "UploadComplete"
	};
	options.url =options.baseurl + jobId
	try{
		await axios.patch(options.url, options.data, {headers:options.headers});
		return true;

	}catch(error){
			return false;
	}
}