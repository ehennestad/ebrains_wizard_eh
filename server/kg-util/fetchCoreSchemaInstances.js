//const axios = require('axios');
const fetch = require("node-fetch")
const fs = require('fs');//&&added by Archana&&//
const path = require('path');//&&added by Archana&&//

const getRequestOptions = require('./getRequestOptions')

// Todo: Load openMINDS json.tpl schemas and extract property names that are part of the schema. 

let fetchCoreSchemaInstances = async () => {

    // Create request header with authorization and options
    const requestOptions = await getRequestOptions();

    // Define some api constants
    const API_BASE_URL = "https://core.kg.ebrains.eu/";
    const API_ENDPOINT = "v3/instances";

    const QUERY_PARAMS = ["stage=RELEASED", "space=common", "type=https://openminds.ebrains.eu/core/"];
    
    const CORE_SCHEMAS = ["Person", "URL"]

    // Loop through core schemas terms and fetch their instances
    for (let i = 0; i < CORE_SCHEMAS.length; i++){

        // Assemble Query URL
        let queryUrl = API_BASE_URL + API_ENDPOINT + "?" + QUERY_PARAMS.join("&") + CORE_SCHEMAS[i];
        let instanceName = CORE_SCHEMAS[i];

        // Fetch instances
        fetchInstance(queryUrl, requestOptions, instanceName) //&&modified by Archana&&//
    }
}

// function to get controlled terms instances from api
function fetchInstance(apiQueryUrl, requestOptions, instanceName) { //&&modified by Archana&&//
    
    fetch(apiQueryUrl, requestOptions)
        .then( response => response.json() )             // Get response promise
            .then( data => parseAndSaveData(data, instanceName) )//&&modified by Archana&&//
        .catch( error => console.log(error.status) )
}

//&&Archana's awesome function to parse data from api and save to json file
function parseAndSaveData(data, instanceName) {
    const resultforjson=[];

    //console.log(data.data)
    for (let datainstance of data.data){
        
        for (const i in datainstance){
            if(i=='@id'){
                var identifier=datainstance[i]
            }
            if(i=='https://openminds.ebrains.eu/vocab/givenName'){
                var givenName=datainstance[i]
            }
            if(i=='https://openminds.ebrains.eu/vocab/familyName'){
                var familyName=datainstance[i]
            }            
        }
        resultforjson.push( datainstance );       
    }

    // Sort by name alphabetically
    //resultforjson.sort((a, b) => a.givenName.localeCompare(b.givenName))

    // Make first letter of instance name lowercase
    instanceName = instanceName.charAt(0).toLowerCase() + instanceName.slice(1);

    const jsonStr = JSON.stringify(resultforjson, null, 2);

    saveFolder = process.cwd() + "/server" + "/data" + "/kg" + "/core-instances/";
    const filePath = path.join(saveFolder, instanceName+'.json');
    
    fs.writeFile(filePath, jsonStr, (err) => {
        if (err) {
            console.log('Failed for ' + instanceName)
            console.error(err);
        } else {
            console.log('File with instances for ' + instanceName + ' written successfully');
        }
    });
}

module.exports = fetchCoreSchemaInstances;

// - - - Simple api query using axios
// apiURL = "https://api.github.com/repos/HumanBrainProject/openMINDS/commits/documentation";
// axios.get( apiURL )
// .then( response => console.log(response) )
