var waitAsec = require('./waitAsec')

/*

This function is where all your work will go. 

*/

module.exports = async (params) => {
    await waitAsec() //The only reason I put this in for the demo is because I know that in real life this function will be async and take some time
    console.log(params)
    //csv_url
    //object_name 

    return {
        paramsReceived: params,
        time: new Date().toLocaleString()
    }
}