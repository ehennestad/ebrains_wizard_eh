const resultjsonObject = require('./ebrains_wizard_metadata-12.json');

// Require node modules
const fs = require('fs');

// Require local modules (openMINDS Schemas)
const DSVjsonObject = require('./datasetVersion.original.schema.tpl.json');
const DSjsonObject = require('./dataset.schema.tpl.json');

const OPENMINDS_VOCAB = "https://openminds.ebrains.eu/vocab/";


const alldsvproperties = Object.keys(DSVjsonObject.properties)
const alldsproperties = Object.keys(DSjsonObject.properties)
var allcontrolledterms = [];

const theDirectory = 'C:/Users/archanag/WORK/OPENMINDS_code/controlledTerms'; // or whatever directory you want to read
fs.readdirSync(theDirectory).forEach((file) => {
    const controlledtermjson = require('./controlledTerms/'+file)
    allcontrolledterms=allcontrolledterms.concat(controlledtermjson)
})

flattenObject = o => Object.keys(o + '' === o || o || 0).flatMap(k => [k, ...f(o[k]).map(i => k + '.' + i)]) //code obtained from https://codegolf.stackexchange.com/questions/195476/extract-all-keys-from-an-object-json

const flatkeys = flattenObject(resultjsonObject)
const alldsvlinkedkeys = []
const alldslinkedkeys = []
var dsvlinkedkeys = []
var dslinkedkeys = []

for (const i in flatkeys) {
    if (flatkeys[i].includes('datasetVersion.')) {
        dsvlinkedkeys = flatkeys[i].split('.')
        alldsvlinkedkeys.push(dsvlinkedkeys[2])
    }
    if (flatkeys[i].includes('dataset.')) {
        dslinkedkeys = flatkeys[i].split('.')
        alldslinkedkeys.push(dslinkedkeys[2])
    }
}
var alldsvlinkedkeysresult = [...new Set(alldsvlinkedkeys)]
var alldslinkedkeysresult = [...new Set(alldslinkedkeys)]

const dsvresultforjson = {}
const resultforhtml = {}
const dsresultforjson = {}

for (i in alldsvlinkedkeysresult) {
    if (alldsvproperties.includes(alldsvlinkedkeysresult[i])) {
        var indexterm = alldsvproperties.indexOf(alldsvlinkedkeysresult[i])
        const properti = Object.values(DSVjsonObject.properties)[indexterm]
        
        // Special case for keyword, as it is not a linked type in practice
        if (alldsvlinkedkeysresult[i] == 'keyword') {
            dsvresultforjson[OPENMINDS_VOCAB + '/keyword'] = resultjsonObject.experiment.datasetVersion.keyword
        }
        else if (Object.keys(properti).includes('_linkedTypes')||Object.keys(properti).includes('_embeddedTypes'))  {
            let resultfield = getresultfield(alldsvlinkedkeysresult[i],'datasetVersion.')
            var finalresultstrings = resultjsonObject[resultfield[0]]['datasetVersion'][alldsvlinkedkeysresult[i]]
            const allidentifiers = []
            if (typeof finalresultstrings=='object') {
                finalresultstrings.forEach(element => {
                    var identifier=getidentifiers(element)
                    if (typeof identifier=='string'){
                        allidentifiers.push({'@id':identifier})
                    }
                    else {
                        let resultfield = getresultfield(alldsvlinkedkeysresult[i],'datasetVersion.')
                        resultforhtml[[alldsvlinkedkeysresult[i]].toString()] = getcellvalue(resultjsonObject[resultfield[0]]['datasetVersion'][alldsvlinkedkeysresult[i]])
                    }              
                })
                if (allidentifiers.length!=0){
                    var keystring = 'https://openminds.ebrains.eu/vocab/' + alldsvlinkedkeysresult[i]
                    dsvresultforjson[keystring] = allidentifiers
                }           
            }
            else {
                var identifier = getidentifiers(finalresultstrings)
                if(typeof identifier == 'string') {
                    allidentifiers.push({'@id':identifier})
                    var keystring = 'https://openminds.ebrains.eu/vocab/' + alldsvlinkedkeysresult[i]
                    dsvresultforjson[keystring] = allidentifiers
                }
                else {
                    let resultfield = getresultfield(alldsvlinkedkeysresult[i],'datasetVersion.')
                    resultforhtml[[alldsvlinkedkeysresult[i]].toString()] = getcellvalue(resultjsonObject[resultfield[0]]['datasetVersion'][alldsvlinkedkeysresult[i]])
                }
            }
        }
        else {
            var keystring = 'https://openminds.ebrains.eu/vocab/' + alldsvlinkedkeysresult[i]
            let resultfield = getresultfield(alldsvlinkedkeysresult[i],'datasetVersion.')
            var finalresultstrings = resultjsonObject[resultfield[0]]['datasetVersion'][alldsvlinkedkeysresult[i]]
            dsvresultforjson[keystring] = finalresultstrings
        }
    }
    else if (alldsvlinkedkeysresult[i] == 'embargo') {     
        if (resultjsonObject.datasetinfo.datasetVersion.embargo.embargo == true) {
            dsvresultforjson['https://openminds.ebrains.eu/vocab/accessibility'] = [{'@id':'https://kg.ebrains.eu/api/instances/897dc2af-405d-4df3-9152-6d9e5cae55d8'}]
            dsvresultforjson['https://openminds.ebrains.eu/vocab/releaseDate'] = resultjsonObject.datasetinfo.datasetVersion.embargo.releaseDate
        }
    } 
    else {
        let resultfield = getresultfield(alldsvlinkedkeysresult[i],'datasetVersion.')
        htmlvalue=getcellvalue(resultjsonObject[resultfield[0]]['datasetVersion'][alldsvlinkedkeysresult[i]])
        if (htmlvalue!='null'){
            resultforhtml[[alldsvlinkedkeysresult[i]].toString()] = getcellvalue(resultjsonObject[resultfield[0]]['datasetVersion'][alldsvlinkedkeysresult[i]])
        }
    }
}

for (i in alldslinkedkeysresult) {
    if (alldslinkedkeysresult[i] == 'fullName'){
        var keystring = 'https://openminds.ebrains.eu/vocab/' + alldslinkedkeysresult[i]
        let resultfield = getresultfield(alldslinkedkeysresult[i],'dataset.')
        var finalresultstrings = resultjsonObject[resultfield[0]]['dataset'][alldslinkedkeysresult[i]]
        dsresultforjson[keystring] = finalresultstrings
    }
    else if (alldslinkedkeysresult[i] == 'authors'){
        var allidentifiers=[]
        resultjsonObject.contributors.dataset.authors.forEach(
            element =>{var identifier=getidentifiers(element.givenName+' '+element.familyName)
            if (typeof identifier=='string'){
                allidentifiers.push({'@id':identifier})
            }
            else {
                let resultfield = getresultfield(alldslinkedkeysresult[i],'dataset.')
                resultforhtml[[alldslinkedkeysresult[i]].toString()] = resultjsonObject.contributors.dataset.authors
            }
        })
        if (allidentifiers.length!=0){
            var keystring = 'https://openminds.ebrains.eu/vocab/' + alldslinkedkeysresult[i]
            dsresultforjson[keystring] = allidentifiers
        } 
        }
    }

console.log('dsvresultforjson',dsvresultforjson)
console.log('dsresultforjson',dsresultforjson)
console.log('resultforhtml',resultforhtml)


////functions for the code
//function to obtain fields in the wizard
function getresultfield(key,schema) {
    for (const j in flatkeys) {
        if (flatkeys[j].includes(schema + key)) {
            var resultfield = flatkeys[j].split('.');
            return resultfield;
        }
    }
}

//function to remove unwanted characters from the strings save on excel
function getcellvalue(input) {
    if (typeof input == 'object') {
        return (JSON.stringify(input)).replace(/\s|\{|\}|\[|\]|\"/g, "");
    } else {
        return input;
    }
}

function getidentifiers(input){
    if (typeof input=='string'){
        for (j in allcontrolledterms) {
            const lowercaseterms = Object.values(allcontrolledterms[j]).map(element => {
                return element.toLowerCase();
            });
            if (lowercaseterms.includes(input.toLowerCase())) {
                return allcontrolledterms[j].identifier               
            }
        }
    }
}