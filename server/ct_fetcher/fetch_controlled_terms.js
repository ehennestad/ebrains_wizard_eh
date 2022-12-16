const axios = require('axios');        // Express is a framework for creating web apps
const fetch = require("node-fetch")
//import esm fetch




const baseurl = "https://core.kg.ebrains.eu/v3-beta/queries/";
let queryUrl = 'https://core.kg.ebrains.eu/v3-beta/queries/52ded04b-6e3a-47d8-a60d-beb00ab99454'

queryUrl = queryUrl 

// Axios get request with authorization in header:

const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJfNkZVSHFaSDNIRmVhS0pEZDhXcUx6LWFlZ3kzYXFodVNJZ1RXaTA1U2k0In0.eyJleHAiOjE2NzA1ODM5NTcsImlhdCI6MTY3MDU4MjE1NywiYXV0aF90aW1lIjoxNjcwNTExNTA2LCJqdGkiOiJlOWVjM2IxNC05MTllLTQ4OTQtYWViNy1mOTUxZDgwNmYwYjYiLCJpc3MiOiJodHRwczovL2lhbS5lYnJhaW5zLmV1L2F1dGgvcmVhbG1zL2hicCIsImF1ZCI6WyJqdXB5dGVyaHViIiwidHV0b3JpYWxPaWRjQXBpIiwieHdpa2kiLCJqdXB5dGVyaHViLWpzYyIsInRlYW0iLCJwbHVzIiwiZ3JvdXAiXSwic3ViIjoiODAwZjUzZTItMzc2Yi00MTA3LWE3OWMtNGFlNzgxMDkzZmI5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoia2ciLCJzZXNzaW9uX3N0YXRlIjoiZWQyN2FiMGYtYWIyZS00MmYyLTg2NTktZDlmMWUwZmJhN2E0IiwiYWNyIjoiMCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgcm9sZXMgZW1haWwgZ3JvdXAgY2xiLndpa2kucmVhZCB0ZWFtIiwic2lkIjoiZWQyN2FiMGYtYWIyZS00MmYyLTg2NTktZDlmMWUwZmJhN2E0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJFaXZpbmQgSGVubmVzdGFkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZWl2aW5kIiwiZ2l2ZW5fbmFtZSI6IkVpdmluZCIsImZhbWlseV9uYW1lIjoiSGVubmVzdGFkIiwiZW1haWwiOiJlaXZpbmQuaGVubmVzdGFkQG1lZGlzaW4udWlvLm5vIn0.gkRQsOIAkpLPQtzIWumLqYS-bolt94zzH6kdgrZhow84wkjVIYZyi6SQbMTou-KxXZApqG0qg_MMO6FLEUPU7kP0zfBG4fqNs0P0H50yj3ecLA-buOoFUiDWhU_FV4LbjJnxINjNWmalTx9AzLUTf-geEfk9kin4jTSORxsPuWUfOpTkzyu_lNhWbEJIFyFFT9GNnz95BLeOazJYGb8Xp7jWsakhA0TfoBtaXm1HykZAboGff_MWgPYuHkaDSxRcrzNDalOYPQY4rT8buHN8ObMzUCskddfx6-vXZK9viZSsP4NR2BRBiaURHgtx7R9mBx_UEQQbze9z3z73DqyrOg";
const requestHeader = { Accept: "*/*", Authorization: "Bearer " + token, 'User-Agent': "python-requests/2.25.0", "Accept-Encoding": "gzip, deflate", 'Connection': 'keep-alive' }
const requestOptions = {headers: requestHeader};
fetch(queryUrl, requestOptions)
    .then( response => console.log(response) )
    .catch( error => console.log(error) )
// console.log(queryUrl)
// axios( {method: 'get', url: queryUrl, header: requestHeader} )
//     .then( response => console.log(response.response.status) )
//     .catch( error => {console.log(error.response.status)} )

// axios.get( queryUrl, requestOptions)
//     .then( response => console.log(response) )
//     .catch( error => console.log(error) )


// let response = fetch( queryUrl )
// .then( response => {console.log(response);  } )
// .catch( error => {console.log(error); } );


function getData(apiurl, headers, scope) {
    url = apiurl + "?stage=" + scope
    resp = rq.get(url, headers=headers)
    
    axios.get(url)
    .then( response => {console.log(response);  } )
    .catch( error => {console.log(error); } );
    data = resp.json()
    return(data)
}




// - - - Simple api query using axios
// apiURL = "https://api.github.com/repos/HumanBrainProject/openMINDS/commits/documentation";
// axios.get( apiURL )
// .then( response => console.log(response) )
