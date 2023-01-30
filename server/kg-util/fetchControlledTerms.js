//const axios = require('axios');
const fetch = require("node-fetch")
const fs = require('fs');//&&added by Archana&&//
const path = require('path');//&&added by Archana&&//

const getRequestOptions = require('./getRequestOptions')
const studyTargetTerms = require('./constants');

let fetchControlledTerms = async () => {

    // Create request header with authorization and options
    const requestOptions = await getRequestOptions();

    // Define some api constants
    const API_BASE_URL = "https://core.kg.ebrains.eu/";
    const API_ENDPOINT = "v3/instances";
    const QUERY_PARAMS = ["stage=RELEASED", "space=controlled", "type=https://openminds.ebrains.eu/controlledTerms/"];

    // List of controlled terms to fetch instances for (Todo: get this from import)
    // IMPORTANT: DatasetLicense should not be a part of this list because it is a manual
    // entry that does not correspond with any openMINDS schema.
    let CONTROLLED_TERMS = ["PreparationType", "Technique", "ContributionType", 
                            "SemanticDataType", "ExperimentalApproach"];
    CONTROLLED_TERMS = CONTROLLED_TERMS.concat(studyTargetTerms);
    
    // Loop through controlled terms and fetch them
    for (let i = 0; i < CONTROLLED_TERMS.length; i++){

        // Assemble Query URL
        let queryUrl = API_BASE_URL + API_ENDPOINT + "?" + QUERY_PARAMS.join("&") + CONTROLLED_TERMS[i];
        instanceName = CONTROLLED_TERMS[i];

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
    for (let datainstance of data.data){

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

module.exports = fetchControlledTerms;

// - - - Simple api query using axios
// apiURL = "https://api.github.com/repos/HumanBrainProject/openMINDS/commits/documentation";
// axios.get( apiURL )
// .then( response => console.log(response) )
