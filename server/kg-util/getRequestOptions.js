// Function to assemble request options including header with token authorization

const fetch = require("node-fetch")
const getServiceAccountAccessToken = require("../services/ebrains-iam/getToken.js")

async function getRequestOptions() {

    let token = await getServiceAccountAccessToken()
        
    const requestHeader = { 
        Accept: "*/*", 
        Authorization: "Bearer " + token, 
        'User-Agent': "python-requests/2.25.0", 
        "Accept-Encoding": "gzip, deflate", 
        'Connection': 'keep-alive' };
        
    const requestOptions = {headers: requestHeader};
    return requestOptions;
}

module.exports = getRequestOptions;
