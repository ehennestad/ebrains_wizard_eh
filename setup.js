
const {setup} = require('./server/internal/update');

if (process.env.NODE_ENV === 'docker-build') {
    console.log ('Skipping setup for docker build process.')
} else {
    console.log('Running setup...')
    setup();
}
