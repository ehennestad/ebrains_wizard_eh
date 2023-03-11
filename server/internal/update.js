var fetchControlledTerms = require('../kg-util/fetchControlledTerms');
var assembleRJSFSchemas = require('./formSchemaAssembler');

const {exec} = require('child_process');

// Todo: make sure nothing is synchronous here 

async function setup() {
    // Log current date and time
    let date = new Date();
    console.log("Running update - ", date);
    
    instanceSpecificationObject = [ 
        {
            openMindsType: "Person",
            instanceProperties: ["familyName", "givenName"]
        },
        {
            openMindsType: "Organization",
            instanceProperties: ["fullName"]
        }
    ];
    await fetchCoreSchemaInstances(instanceSpecificationObject)
    await fetchControlledTerms();
    await assembleRJSFSchemas();
    // Redo the build of the react app in order for the updated terms to reach the frontend
    exec('npm run build') 
}

// Run timer that fetches controlled terms instances from openMINDS every 24 hours
const timerInterval = 24 * 60 * 60 * 1000; // 24 hours
let updateFunction = () => setInterval(setup, timerInterval);

module.exports = updateFunction;
