const path = require('path');
const fs = require('fs');

// returns an array of all instances of controlled terms
async function getControlledTerms (termNames) {
    const sourcePath = path.join(__dirname, '../../src/controlledTerms/');
    const numTerms = termNames.length;

    const controlledTermArray = Array.from({ length: numTerms }, (_, i) => {
        //return import(`${sourcePath}/${termNames[i]}.json`).then(json => json.default)
        return require(`${sourcePath}/${termNames[i]}.json`);
    })

    return await Promise.all(controlledTermArray);
};

// returns an object with all controlled terms as key value pairs
function importControlledTerms(termNames) {

    const sourcePath = path.join(__dirname, '../../src/controlledTerms/');
    const numTerms = termNames.length;

    const filePaths = Array.from({ length: numTerms }, (_, i) => {
        // make first letter of term name lowercase for filename
        fileName = pascalCase2CamelCase(termNames[i]) + '.json';
        return path.join(sourcePath, fileName);
    })
    
    let jsonObject = {};
    for (let i = 0; i < filePaths.length; i++) {
        let thisFilepath = filePaths[i];
        let thisTerm = termNames[i];
        let jsonContent = JSON.parse(fs.readFileSync(thisFilepath));
        jsonObject[thisTerm] = jsonContent;
    };
    return jsonObject;
}

function pascalCase2CamelCase(name) {
    return name.charAt(0).toLowerCase() + name.slice(1);
}

module.exports = {getControlledTerms, importControlledTerms};


