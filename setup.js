var fetchControlledTerms = require('./server/kg-util/fetchControlledTerms');
var fetchCoreSchemaInstances = require('./server/kg-util/fetchCoreSchemaInstances'); // Todo?

const {exec} = require('child_process');

setup();

async function setup() {
    // Fetch controlled terms from KG
    // This is done before the React App is built so that the controlled terms are available

    var startTime = performance.now()

    configObject = {
        openMindsType: "Person",
        instanceProperties: ["familyName", "givenName"]
    }
    console.log('Fetching openMINDS instances...')
    fetchCoreSchemaInstances(configObject)
        .then( () => {
            console.log('Fetching controlled terms...')
            fetchControlledTerms()
                .then( () => {
                    var endTime = performance.now()
                    console.log(`Fetched all instance and controlled terms in: ${(endTime - startTime)/1000} seconds`)
                    
                    // Make this import here, because the controlled term files are needed before the module can be properly imported
                    var assembleRJSFSchemas = require('./server/internal/formSchemaAssembler');

                    assembleRJSFSchemas()
                    .then( () => {
                        console.log('Assembled form schemas from templates and controlled terms.')

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
                })
                .catch(err => {
                    console.log('Error fetching controlled terms: ' + err);
                })
        })
        .catch(err => {
            console.log('Error fetching openMINDS instances: ' + err);
        }
    )
}
