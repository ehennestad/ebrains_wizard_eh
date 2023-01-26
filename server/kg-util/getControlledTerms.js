const path = require('path');
const fs = require('fs');

async function getControlledTerms (termNames) {
    const sourcePath = path.join(__dirname, '../../src/controlledTerms/');
    const numTerms = termNames.length;

    const controlledTermArray = Array.from({ length: numTerms }, (_, i) => {
        //return import(`${sourcePath}/${termNames[i]}.json`).then(json => json.default)
        return require(`${sourcePath}/${termNames[i]}.json`);
    })

    return await Promise.all(controlledTermArray);
};
function importControlledTerms(termNames) {

    const sourcePath = path.join(__dirname, '../../src/controlledTerms/');
    const numTerms = termNames.length;

    const filePaths = Array.from({ length: numTerms }, (_, i) => {
        return `${sourcePath}/${termNames[i]}.json`;
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
module.exports = {getControlledTerms, importControlledTerms};


