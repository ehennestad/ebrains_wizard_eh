//const axios = require('axios');
const fetch = require("node-fetch")
const fs = require('fs');//&&added by Archana&&//
const path = require('path');//&&added by Archana&&//
const math = require('mathjs');//&&added by Archana&&//

let ctFetcher = () => {

    // Token for kg authorization
    const token = process.env.KG_TOKEN;
    // Create request header with authorization and options
    const requestOptions = getRequestOptions(token);

    // Define some api constants
    const API_BASE_URL = "https://core.kg.ebrains.eu/";
    const API_ENDPOINT = "v3/instances";
    const QUERY_PARAMS = ["stage=RELEASED", "space=controlled", "type=https://openminds.ebrains.eu/controlledTerms/"];

    // List of controlled terms to fetch instances for
    CONTROLLED_TERMS = ["PreparationType"];//,"Technique"]//

    // Loop through controlled terms and fetch them
    for (let i = 0; i < CONTROLLED_TERMS.length; i++){

        // Assemble Query URL
        let queryUrl = API_BASE_URL + API_ENDPOINT + "?" + QUERY_PARAMS.join("&") + CONTROLLED_TERMS[i];
        instanceName = CONTROLLED_TERMS[i];

        // Fetch instances
        //fetchInstance(queryUrl, requestOptions)
        fetchInstance(queryUrl, requestOptions, instanceName) //&&modified by Archana&&//
    }
}

// function to get controlled terms instances from api
//function fetchInstance(apiQueryUrl, requestOptions) { 
function fetchInstance(apiQueryUrl, requestOptions, instanceName) { //&&modified by Archana&&//
    
    fetch(apiQueryUrl, requestOptions)
        .then( response => response.json() )             // Get response promise
            .then( data => parseAndSaveData(data, instanceName) )//&&modified by Archana&&//
        .catch( error => console.log(error.status) )
}

//&&Archana's awesome function to parse data from api and save to json file
function parseAndSaveData(data, instanceName) {
    const resultforjson=[];
    for (let datainstance of data.data){

        // Create a random number
        var randomnumber = math.random()

        // skip random iterations
        if(randomnumber>0.5){
            continue
        }

        for (const i in datainstance){
            if(i=='@id'){
                var identifier=datainstance[i]
            }
            if(i=='https://openminds.ebrains.eu/vocab/name'){
                var name=datainstance[i]
            }            
        }
        resultforjson.push( {"identifier":identifier, "name":name} );       
    }

    // Sort by name alphabetically
    resultforjson.sort((a, b) => a.name.localeCompare(b.name))

    // Make first letter of instance name lowercase
    instanceName = instanceName.charAt(0).toLowerCase() + instanceName.slice(1);

    const jsonStr = JSON.stringify(resultforjson, null, 2);

    saveFolder = process.cwd() + "/src" + "/controlledTerms/";
    const filePath = path.join(saveFolder, instanceName+'.json');
    
    fs.writeFile(filePath, jsonStr, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('File with instances for ' + instanceName + ' written successfully');
        }
    });
}

// Function to assemble request options including header with token authorization
function getRequestOptions(token) {
    const requestHeader = { 
        Accept: "*/*", 
        Authorization: "Bearer " + token, 
        'User-Agent': "python-requests/2.25.0", 
        "Accept-Encoding": "gzip, deflate", 
        'Connection': 'keep-alive' };
        
    const requestOptions = {headers: requestHeader};
    return requestOptions;
}

module.exports = ctFetcher;

// - - - Simple api query using axios
// apiURL = "https://api.github.com/repos/HumanBrainProject/openMINDS/commits/documentation";
// axios.get( apiURL )
// .then( response => console.log(response) )
