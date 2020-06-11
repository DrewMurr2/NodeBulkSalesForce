var axios = require('axios')

module.exports = async function createbatch(options, cObjName) {

	let jobId;
    let requestBody ={
        "object":cObjName,
        "contentType":"CSV",
        "operation":"insert",
        "columnDelimiter":"SEMICOLON"
	}
	options.data = requestBody
	options.url = options.baseurl
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