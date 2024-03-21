
const fetch = require("node-fetch")
const fs = require('fs');
const path = require('path');

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

// typeSpecification object should contain the following properties:
// - openMindsType // short name for the openminds type, e.g: "Person"
// - typeProperties // list of properties to save for this type, e.g: ["familyName", "givenName"]
// - space // Optional, defaults to "common" (KG space to search for instances)

let fetchCoreSchemaInstances = async (typeSpecifications) => {
    // Create request header with authorization and options
    const requestOptions = await getRequestOptions();

    return new Promise((resolve, reject) => {
        
        // Define some api constants
        const API_BASE_URL = "https://core.kg.ebrains.eu/";
        const API_ENDPOINT = "v3/instances";

        typeSpecifications.forEach(async (typeSpecification) => {
            let spaceName = "common";
            if (typeSpecification.space !== undefined) {
                spaceName = typeSpecification.space;
            }

            const QUERY_PARAMS = ["stage=RELEASED", `space=${spaceName}`, "type=https://openminds.ebrains.eu/core/"];
            const TYPE_NAME = typeSpecification.openMindsType;

            var completedRequests = 0;

            // Assemble Query URL
            let queryUrl = `${API_BASE_URL}${API_ENDPOINT}?${QUERY_PARAMS.join("&")}${TYPE_NAME}`;

            try {
                // Fetch instances
                const data = await fetchInstances(queryUrl, requestOptions, TYPE_NAME, typeSpecification.typeProperties);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    });
}

// function to get schema instances from kg api
function fetchInstances(apiQueryUrl, requestOptions, typeName, propertyNames) {

    return new Promise((resolve, reject) => {
        fetch(apiQueryUrl, requestOptions)
            .then( response => {
                if (response.status===200) {
                    return response.json() 
                } else {
                    console.log('Error fetching instances for ' + typeName + '. Status code: ' + response.status);
                    throw new Error('Error fetching instances for ' + typeName + '. Status code: ' + response.status)
                    reject()
                }
                }) // Get response promise
                .then( data => parseAndSaveData(data, typeName, propertyNames).then( (instances) => resolve(instances) ) )
                .catch( error => {reject(error); console.log(error) } )
    });
}

// Parse and save schema instances
function parseAndSaveData(data, typeName, propertyNameList) {
    return new Promise((resolve, reject) => {

        const typeInstanceList = [];

        for (let thisInstance of data.data){
            let newInstance = {"identifier": thisInstance["@id"]};

            let isEmpty = true;

            for (let i in propertyNameList) {
                vocabName = OPENMINDS_VOCAB + "/" + propertyNameList[i];
                if (thisInstance[vocabName] != undefined) {
                    isEmpty = false;
                    newInstance[propertyNameList[i]] = thisInstance[vocabName];
                }
            }
            if (!isEmpty) {
                typeInstanceList.push( newInstance ); 
            }     
        }
        
        // Save results to json file
        const jsonStr = JSON.stringify(typeInstanceList, null, 2);

        const filename = typeName + '.json';
        const filePath = path.join(INSTANCE_OUTPUT_DIRECTORY, filename);
        
        fs.writeFile(filePath, jsonStr, (err) => {
            if (err) {
                console.error(err);
                reject(err)
            } else {
                console.log('File with instances for ' + typeName + ' written successfully');
                resolve()
            }
        });
    });
}

module.exports = fetchCoreSchemaInstances;
