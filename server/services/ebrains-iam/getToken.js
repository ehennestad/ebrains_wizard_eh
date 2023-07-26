// Function to get service account access token and related information

const fetch = require("node-fetch")

async function getServiceAccountAccessToken() {
    let response = await getTokenResponse();
    return response.access_token;
}


// Todo:
// - add service account name, secret and scopes as function inputs.
async function getTokenResponse() {
    // todo get token form env until service account token works

    let endpointURL = "https://iam.ebrains.eu/auth/realms/hbp/protocol/openid-connect/token";
    let secret = process.env.OIDC_CLIENT_SECRET;

    // Todo: Define this as an object and use querystring.stringify
    let body = "grant_type=client_credentials&client_id=ebrains-wizard-dev&client_secret=" + secret + "&scope=email%20profile%20team%20group";
    
    let requestOptions = {
	    method: 'post',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	    body: body
    };

    let result = await fetch(endpointURL, requestOptions)
    jsonData = await result.json();

    return jsonData;
}

async function printUserInfo(accessToken) {

    // get userinfo
    let api_url = "https://iam.ebrains.eu/auth/realms/hbp/protocol/openid-connect/userinfo"
    let requestOptions = {
        method: 'get',
        headers: {Authorization: "Bearer " + accessToken}
    };

    let response = await fetch(api_url, requestOptions)
    userInfoObject = await response.json();
    console.log('User info', userInfoObject)
}

// Export getServiceAccountAccessToken as default and printUserInfo as named export
module.exports = getServiceAccountAccessToken;
module.exports.printUserInfo = printUserInfo;
module.exports.getTokenResponse = getTokenResponse;


