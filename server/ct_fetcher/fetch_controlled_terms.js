//const axios = require('axios');
const fetch = require("node-fetch")

// Token for kg authorization
const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJfNkZVSHFaSDNIRmVhS0pEZDhXcUx6LWFlZ3kzYXFodVNJZ1RXaTA1U2k0In0.eyJleHAiOjE2NzE0MDM0MzgsImlhdCI6MTY3MTQwMTYzOCwiYXV0aF90aW1lIjoxNjcxMTk2NzgxLCJqdGkiOiJmYTQ3YTdjNy01NGE4LTQ5MTItYjVhOS1kZWU1YjFhM2FiMDQiLCJpc3MiOiJodHRwczovL2lhbS5lYnJhaW5zLmV1L2F1dGgvcmVhbG1zL2hicCIsImF1ZCI6WyJqdXB5dGVyaHViIiwidHV0b3JpYWxPaWRjQXBpIiwieHdpa2kiLCJqdXB5dGVyaHViLWpzYyIsInRlYW0iLCJwbHVzIiwiZ3JvdXAiXSwic3ViIjoiODAwZjUzZTItMzc2Yi00MTA3LWE3OWMtNGFlNzgxMDkzZmI5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoia2ciLCJub25jZSI6ImUwMjdjMDVlLTdmZWEtNGM2Ny05Y2JhLTc5MmE0ZWFhZmI5NCIsInNlc3Npb25fc3RhdGUiOiIxYTU2MjY5ZC1lMWE0LTQ0Y2YtYjJlNy1jMjQ0NWYzZTRmMWEiLCJhY3IiOiIwIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSByb2xlcyBlbWFpbCBncm91cCBjbGIud2lraS5yZWFkIHRlYW0iLCJzaWQiOiIxYTU2MjY5ZC1lMWE0LTQ0Y2YtYjJlNy1jMjQ0NWYzZTRmMWEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkVpdmluZCBIZW5uZXN0YWQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJlaXZpbmQiLCJnaXZlbl9uYW1lIjoiRWl2aW5kIiwiZmFtaWx5X25hbWUiOiJIZW5uZXN0YWQiLCJlbWFpbCI6ImVpdmluZC5oZW5uZXN0YWRAbWVkaXNpbi51aW8ubm8ifQ.vKKgcwjZDUJgaH3WDO5M1Z1aZWChj5SrmczGjAKHJ_lewOzWluSveKT3OiaPQv2OhzD5qmf2ujEOTObSGbMn_YGvWqWe_purYfYkjw8jFqvL9iw-NvBq6zDB484aOmU_hOVxzD4g3QD5IxpfgqaVymeZTi56wVi4Yr27X2rmDpP4wkGZcsuRDziIZOCPZ6r7YboYcFGtHhlBVrPfOkhQ8PutCs7kjt93LRvuSirL8PMLGXfRPfFqg4o79tORS5wUdRQz0RpwV8bI-r-vEk39qHcu5WWZcORs131OdTtcXPf-Bof7scj6HFK_aT5wMmIxFJjJ5ovDQ1y2IFnrPmzZXg";

// Create request header with authorization and options
const requestOptions = getRequestOptions(token);

// Define some api constants
const API_BASE_URL = "https://core.kg.ebrains.eu/";
const API_ENDPOINT = "v3/instances";
const QUERY_PARAMS = ["stage=RELEASED", "space=controlled", "type=https://openminds.ebrains.eu/controlledTerms/"];

// List of controlled terms to fetch instances for
CONTROLLED_TERMS = ["PreparationType", "Technique"];

// Loop through controlled terms and fetch them
for (let i = 0; i < CONTROLLED_TERMS.length; i++){

    // Assemble Query URL
    let queryUrl = API_BASE_URL + API_ENDPOINT + "?" + QUERY_PARAMS.join("&") + CONTROLLED_TERMS[i];

    // Fetch instances
    fetchInstance(queryUrl, requestOptions)
}

// function to get controlled terms instances from api
function fetchInstance(apiQueryUrl, requestOptions) {
    
    fetch(apiQueryUrl, requestOptions)
        .then( response => response.json() )             // Get response promise
            .then( data => parseAndSaveData(data) )
        .catch( error => console.log(error.status) )
}

// function to parse data from api and save to json file
function parseAndSaveData(data) {
    
    // loop through each instance in data and create array with id and name
    console.log(data);
    // create file path for json file

    // save data to json file

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


// - - - Simple api query using axios
// apiURL = "https://api.github.com/repos/HumanBrainProject/openMINDS/commits/documentation";
// axios.get( apiURL )
// .then( response => console.log(response) )
