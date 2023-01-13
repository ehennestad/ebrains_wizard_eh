var fetchControlledTerms = require('../kg_util/fetchControlledTerms');
const {exec} = require('child_process');

async function setup() {
    let result = await fetchControlledTerms();
    // Redo the build of the react app in order for the updated terms to reach the frontend
    exec('npm run build') 
}

// Run timer that fetches controlled terms instances from openMINDS every 24 hours
const timerInterval = 24 * 60 * 60 * 1000; // 24 hours
let updateFunction = () => setInterval(setup, timerInterval);

module.exports = updateFunction;
