
module.exports = async function message(content, params, data) {
	let message = {
		paramsReceived: params,
		status: 'Error',
		message: content,
        time: new Date().toLocaleString()
	};
	if( data == null || data == false)
		return message
	message['Data'] = data;
	message['status'] = 'Success'
	return message;
}