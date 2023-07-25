var fetchCoreSchemaInstances = require('../kg-util/fetchCoreSchemaInstances');
var fetchControlledTerms = require('../kg-util/fetchControlledTerms');
var assembleRJSFSchemas = require('./formSchemaAssembler');

const {exec} = require('child_process');

// Todo: make sure nothing is synchronous here 
// Todo: Make sure this does not redo the react-build if fetching from KG fails

async function setup() {
    // Log current date and time
    let date = new Date();
    console.log("Running update - ", date);
    
    let instanceSpecificationObject = {
        openMindsType: "Person",
        instanceProperties: ["familyName", "givenName"]
    }
    try {
        await fetchCoreSchemaInstances(instanceSpecificationObject)
        await fetchControlledTerms();
        await assembleRJSFSchemas();
        // Redo the build of the react app in order for the updated terms to reach the frontend
        exec('npm run build')
    } catch (error) {
        console.log("Failed to run scheduled update")
        console.log(error)
    }
}

// Run timer that fetches controlled terms instances from openMINDS every 24 hours
const timerInterval = 24 * 60 * 60 * 1000; // 24 hours
let updateFunction = () => setInterval(setup, timerInterval);

module.exports = updateFunction;
