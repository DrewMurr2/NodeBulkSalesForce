var axios = require('axios')
var csvtojson = require('csvtojson')

module.exports = async function getcsvfile(url, conn, CObjName) {
 
	let csv_data;
	let jsonParseData = [];
	let csvStream = ""
	let fields = [];
	try{
		let response = await axios.get(url);
		await csvtojson().fromString(response.data).then((json)=>{csv_data = json})

	}catch(err){
		return null;
	}

	for( var i = 0; i < csv_data.length; i++ ){
		let row = csv_data[i];
		let newRaw = {};
		newRaw["Name"] = i+1;
		Object.keys(row).map(item=>{
			newRaw[item+"__c"] = row[item];
		})
		jsonParseData.push(newRaw);
	}
	keys = Object.keys(jsonParseData[0]);
	for( var i = 0; i < keys.length-1; i++ ){
		csvStream +=keys[i] + ';';
	}
	csvStream += keys[keys.length-1];
	for( var i = 0; i < jsonParseData.length; i++ ){
		for( var j = 0; j < keys.length; j++ ){
			if( j == 0 ) csvStream +='\n';
			else csvStream += ';';
			csvStream += jsonParseData[i][keys[j]];
		}
	}
  
	if( jsonParseData.length == 0 ){
		return null;
	}

	Object.keys(csv_data[0]).map(item=>{   // make salesforce custom objects fieldnames and property
		fields.push({
			fullName: CObjName + "."+item + "__c",
			label: item,
			type: 'Text',
			length: 250,
			required:true,
			externalId:true
		})
	});
	await conn.metadata.upsert('CustomField', fields)  
	return csvStream;

}