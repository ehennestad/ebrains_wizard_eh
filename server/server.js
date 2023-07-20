// This script configures the backend server that is used for sending the 
// user-submitted metadata to the ebrains curation team

// Get installed node modules that are needed for the server
const express         = require('express');           // Express is a framework for creating web apps
const path            = require('path');              // Path is used for creating file paths
const sceduledUpdater = require('./internal/update'); // Module that is used for updating the controlled terms

// Path to the static files that are served by the server
const STATIC_DIR = path.join(__dirname, '..', '/build');

// This app is deployed on OpenShift, and containers in OpenShift should bind to
// any address (which is designated with 0.0.0.0) and use port 8080 by default
const ip = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 8080;


// Create and configure the express app
// - - - - - - - - - - - - - - - - - - - - - - - - 

const app = express()

// Specify that the root directory for serving the files are the 
// build folder (Important!) When index.html refers to the static files,
// it will look in the static (in this case /build) folder for them.
app.use(express.static(STATIC_DIR));

// Define "api" routes for the frontend client. These routes are defined before 
// the static file serving, so that the static file serving does not override 
// the api routes
const submissionRouter = require('./routes/submission');
app.use('/api/submission', submissionRouter);

const uploadRouter = require('./routes/upload');
app.use('/api/upload', uploadRouter);

const consoleRouter = require('./routes/console');
app.use('/api/console', consoleRouter);

app.get('/test' , (req, res) => { res.send('Ok') }) // Test route

// Serve the react app on the default (/) route. Use /* to allow for
// frontend routing to work.
app.get('/*', function(req, res) {
  let indexFile = path.join(STATIC_DIR, '/index.html' )
  res.sendFile( indexFile, err => { onIndexFileSent(err, res) } )
});

// console.log that the server is up and running
let date = new Date();
console.log("Initialising server - ", date);
app.listen(port, () => console.log(`Listening on port ${port}`));

// Start the scheduled updater which updates the controlled terms every 24 hours
sceduledUpdater()

// Function that is called when the index.html file has been sent to the client
function onIndexFileSent(err, res) {
  if (err) {
    if (err.code === 'ENOENT') {
      res.send('Server is updating. It should be back up and running within a minute. If it takes longer, please let us know!')
    } else {
      res.send('Internal server error.')
    }
    console.log(err)
  } else {
    console.log('Sent index.html')
  }
}
