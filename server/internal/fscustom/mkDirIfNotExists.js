const fsp = require('fs').promises;

module.exports = mkdirIfNotExists;

async function mkdirIfNotExists(directory) {
    try {
        await fsp.mkdir(directory, { recursive: true });
        // Log folder created and folder name
        console.log("New directory successfully created: " + directory);
    } catch (err) {
        if (err.code === 'EEXIST') {
            console.log("Directory already exists.");
        } else {
            console.error(err);
        }
    }
}