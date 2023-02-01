var fetchControlledTerms = require('./server/kg-util/fetchControlledTerms');
var fetchCoreSchemaInstances = require('./server/kg-util/fetchCoreSchemaInstances');

const {exec} = require('child_process');

async function setup() {
    
    console.log('Fetching controlled terms...')
    //var startTime = performance.now()
    //let result1 = await fetchControlledTerms();
    let result2 = await fetchCoreSchemaInstances();

    //var endTime = performance.now()
    //console.log(`Fetching controlled terms took: ${endTime - startTime} milliseconds`)
    console.log('Done fetching controlled terms.')
    
    console.log('Creating build...')
    //var startTime = performance.now()
    //exec('npm run build') // Redo the build in order for the updated terms to be used by the frontend
    //var endTime = performance.now()
    //console.log(`Creating build took: ${endTime - startTime} milliseconds`)
    console.log('Done creating build.')
}

setup();