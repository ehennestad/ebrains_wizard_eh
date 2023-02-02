var fetchControlledTerms = require('./server/kg-util/fetchControlledTerms');
const {exec} = require('child_process');

setup();

async function setup() {
    // Fetch controlled terms from KG
    // This is done before the React App is built so that the controlled terms are available

    console.log('Fetching controlled terms...')
    var startTime = performance.now()

    fetchControlledTerms()
        .then( () => {
            var endTime = performance.now()
            console.log(`Fetched all controlled terms in: ${(endTime - startTime)/1000} seconds`)

            // Redo the build in order for the updated terms to be used by the frontend
            console.log('Creating a production build for the React App...')           
            exec('npm run build', (err) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                } else {
                    console.log(`Completed React App build in: ${(performance.now() - endTime)/1000} seconds`);
                }
                //console.log(`Completed React App build in: ${(performance.now() - endTime)/1000} seconds`);
            }); 
        })
        .catch(err => {
            console.log('Error fetching controlled terms: ' + err);
        })
}
