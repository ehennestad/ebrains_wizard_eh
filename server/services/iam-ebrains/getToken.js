// Function to assemble request options including header with token authorization

const fetch = require("node-fetch")

async function getTokenFromServiceAccount() {

    let endpointURL = "https://iam.ebrains.eu/auth/realms/hbp/protocol/openid-connect/token";
    let secret = process.env.OIDC_CLIENT_SECRET;

    let body = "grant_type=client_credentials&client_id=ebrains-wizard-dev&client_secret=" + secret + "&scope=email%2Bprofile%2Bteam%2Bgroup%2Bclb.wiki.read";
    
    let requestOptions = {
	    method: 'post',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	    body: body
    };

    let result = await fetch(endpointURL, requestOptions)
    jsonData = await result.json();
    console.log('jsondata', jsonData)
    return jsonData.access_token;
}

module.exports = getTokenFromServiceAccount;
