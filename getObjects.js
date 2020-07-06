var waitAsec = require('./waitAsec')
var salesforceconnectionlogin = require('./login')

module.exports = async function GetallObjects() {
    await waitAsec()
    let connection = await salesforceconnectionlogin(); 
    console.log("Access Token is:" + connection.accessToken)
    var types = [{type: 'CustomObject', folder: null}];
	try{
		connection.metadata.list(types, '48.0', function(err, metadata) {
            if (err) { return console.error('err', err); }
            for (var i=0; i < metadata.length; i++) {
                try{
                    connection.describe(metadata[i].fullName, function(err, meta) {
                        if (err) { return false; }
                        console.log('==================================================');
                        console.log('name :'+ meta.name)
                        console.log('labelPlural : ' + meta.labelPlural);
                        console.log('retrieveable : ' + meta.retrieveable);
                        console.log('replicateable : ' + meta.replicateable);
                        console.log('searchable : ' + meta.searchable);
                        console.log('Label : ' + meta.label);
                        console.log('deletable : ' + meta.deletable);
                        console.log('custom : ' + meta.custom);
                        console.log('createable : ' + meta.createable);
                        console.log('Fields length: ' +meta.fields.length);
                        for (var i=0; i < meta.fields.length; i++) {
                            console.log('-----Field name  : ' +meta.fields[i].name);
                            console.log('-------length : ' +meta.fields[i].length);
                            console.log('-------autoNumber : ' +meta.fields[i].autoNumber);
                            console.log('-------caseSensitive : ' +meta.fields[i].caseSensitive);
                            console.log('-------custom : ' +meta.fields[i].custom);
                            console.log('-------idLookup : ' +meta.fields[i].idLookup);
                            console.log('-------label : ' +meta.fields[i].label);
                            console.log('-------permissionable : ' +meta.fields[i].permissionable);
                            console.log('-------byteLength : ' +meta.fields[i].byteLength);
                        }
                    });
                   
                }catch(err){ return null }
            }
        });	
	}catch(err){ return null }
}