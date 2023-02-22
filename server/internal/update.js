var fetchControlledTerms = require('../kg-util/fetchControlledTerms');
var assembleRJSFSchemas = require('./formSchemaAssembler');

const {exec} = require('child_process');

async function setup() {
    await fetchControlledTerms();
    await assembleRJSFSchemas();
    // Redo the build of the react app in order for the updated terms to reach the frontend
    exec('npm run build') 
}

// Run timer that fetches controlled terms instances from openMINDS every 24 hours
const timerInterval = 24 * 60 * 60 * 1000; // 24 hours
let updateFunction = () => setInterval(setup, timerInterval);

module.exports = updateFunction;
