var axios = require('axios')

module.exports = async function createbatch(options) {

	let jobId;
	try{
		let response = await axios.post(options.url, options.data,{
			headers:options.headers
		});
		jobId = response.data.id;
		return (jobId === undefined) ? null : jobId
	}catch(error){
		return null;
	}
}