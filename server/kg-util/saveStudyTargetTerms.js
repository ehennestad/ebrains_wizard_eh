const studyTargetTerms = require('./constants');
const {importControlledTerms} = require('./getControlledTerms');
const fs = require('fs');
const path = require('path');//&&added by Archana&&//

const controlledTerms = importControlledTerms(studyTargetTerms)
const jsonStr = JSON.stringify(controlledTerms, null, 2);

saveFolder = process.cwd() + "/src" + "/controlledTerms/";

const filePath = path.join(saveFolder, 'studyTargetTermGroup.json');
    
fs.writeFile(filePath, jsonStr, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('File with instances for studyTargetTermGroup written successfully');
    }
});