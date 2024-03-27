const fetchDataFromKg       = require('./fetchDataFromKg');
// Todo: If possible, make sure this can be imported here, even though
// instances are not fetched from KG yet
//const assembleRJSFSchemas   = require('./createFormSchemas');

const {exec} = require('child_process');

// Todo: make sure nothing is synchronous here 
// Todo: Make sure this does not redo the react-build if fetching from KG fails

async function setup() {
    
    try {
        try {
            var startTime = performance.now()
            await fetchDataFromKg();
            var endTime = performance.now()
            console.log(`Fetched all KG instances in: ${(endTime - startTime)/1000} seconds`)
        } catch (error) {
            console.log("Failed to fetch data from KG")
            // Rethrow the error so that the catch block below can handle it
            throw error
        }

        // Make this import here, because the controlled term instance files
        // are needed before the module can be properly imported.
        const assembleRJSFSchemas = require('./createFormSchemas');
        await assembleRJSFSchemas();
        
        // Redo the build of the react app in order for the updated terms to reach the frontend
        console.log("")
        console.log('Creating a production build for the React App...')           
        exec('npm run build', (err) => {
            if (err) {
                console.error(`exec error: ${err}`);
            } else {
                console.log(`Completed React App build in: ${(performance.now() - endTime)/1000} seconds`);
            }
        }); 
    } catch (error) {
        console.log("Failed to run scheduled update")
        console.log(error)
        // Todo: Retry in x amount of time
    }
}

async function update() {

    // Log current date and time
    let date = new Date();
    
    console.log("")
    console.log("Running update - ", date);
    await setup()
}

// Run timer that fetches controlled terms instances from openMINDS every 24 hours
const timerInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
let sceduledUpdater = () => setInterval(update, timerInterval);

module.exports = {sceduledUpdater, setup};
