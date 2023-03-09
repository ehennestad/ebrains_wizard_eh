//const axios = require('axios');
const fetch = require("node-fetch")
const fs = require('fs');//&&added by Archana&&//
const path = require('path');//&&added by Archana&&//

const getRequestOptions = require('./getRequestOptions')

const OPENMINDS_VOCAB = "https://openminds.ebrains.eu/vocab";
const INSTANCE_OUTPUT_DIRECTORY = path.join(__dirname, '..', 'data', 'kg-instances');

fs.mkdir(INSTANCE_OUTPUT_DIRECTORY, { recursive: true }, (err) => {
    if (err) {
        if (err.code === 'EEXIST') {
            console.log("Directory already exists.");
        } else {
            console.log(err);
        }
    } else {
        console.log("New directory successfully created.");
    }
});

// config instanceSpecification should contain the following properties:
// - openMindsType
// - instanceProperties

// Todo: Support array input for instanceSpecification

let fetchCoreSchemaInstances = async (instanceSpecification) => {

    // Create request header with authorization and options
    const requestOptions = await getRequestOptions();

    return new Promise((resolve, reject) => {

        // Define some api constants
        const API_BASE_URL = "https://core.kg.ebrains.eu/";
        const API_ENDPOINT = "v3/instances";

        const QUERY_PARAMS = ["stage=RELEASED", "space=common", "type=https://openminds.ebrains.eu/core/"];
        
        //const CORE_SCHEMAS = ["Person", "URL"]
        const CORE_SCHEMAS = [instanceSpecification.openMindsType];

        // Loop through core schemas terms and fetch their instances
        for (let i = 0; i < CORE_SCHEMAS.length; i++){

            // Assemble Query URL
            let queryUrl = API_BASE_URL + API_ENDPOINT + "?" + QUERY_PARAMS.join("&") + CORE_SCHEMAS[i];
            let instanceName = CORE_SCHEMAS[i];

            // Fetch instances
            fetchInstance(queryUrl, requestOptions, instanceName, instanceSpecification.instanceProperties)
            .then( (data) => resolve(data) )
        }
    });
}

// function to get schema instances from kg api
function fetchInstance(apiQueryUrl, requestOptions, instanceName, propertyNames) {

    return new Promise((resolve, reject) => {
        fetch(apiQueryUrl, requestOptions)
            .then( response => response.json() )             // Get response promise
                .then( data => parseAndSaveData(data, instanceName, propertyNames).then( (instances) => resolve(instances) ) )
            .catch( error => {reject(error); console.log(error.type) } )
    });
}

// Parse and save schema instances
function parseAndSaveData(data, instanceName, propertyNameList) {
    return new Promise((resolve, reject) => {

        const resultforjson=[];

        for (let datainstance of data.data){
            let newInstance = {"identifier": datainstance["@id"]};

            for (let i in propertyNameList) {
                vocabName = OPENMINDS_VOCAB + "/" + propertyNameList[i];
                if (datainstance[vocabName] != undefined) {
                    newInstance[propertyNameList[i]] = datainstance[vocabName];
                }
            }
            resultforjson.push( newInstance );       
        }
        // console.log('instanceName, resultforjson', instanceName, resultforjson[0])
        // resolve(resultforjson)

        // Todo: Consider whether to save the instances to a file or to return them as a json object.
        // Make first letter of instance name lowercase
        //instanceName = instanceName.charAt(0).toLowerCase() + instanceName.slice(1);

        const jsonStr = JSON.stringify(resultforjson, null, 2);

        console.log('this too')
        saveFolder = process.cwd() + "/server" + "/data" + "/kg-instances/";
        const filePath = path.join(saveFolder, instanceName+'.json');
        
        fs.writeFile(filePath, jsonStr, (err) => {
            if (err) {
                console.error(err);
                reject(err)
            } else {
                console.log('File with instances for ' + instanceName + ' written successfully');
                resolve()
            }
        });
    });
}

module.exports = fetchCoreSchemaInstances;
