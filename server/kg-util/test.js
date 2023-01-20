const studyTargetTerms = require('./constants');
const {importControlledTerms} = require('./getControlledTerms');


const controlledTerms = importControlledTerms(studyTargetTerms)
console.log(controlledTerms);