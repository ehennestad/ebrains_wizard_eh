// This code takes the json output from wizard and gives two json files (DS,DSV) with identifiers for results. 
// These json files can then be uploaded to KG directly. 
// In addition, it will also output an html file with all the fields that the curators need to input manually.

const path = require('path');
const fs = require('fs');

//const resultjsonObject = require('./ebrains_wizard_metadata-12.json');
//translatewizardjson(resultjsonObject)

module.exports = translateWizardFormdata;

const CONTROLLED_TERM_INSTANCE_DIRECTORY = path.join(__dirname, '../../src/controlledTerms/');


function translateWizardFormdata(resultjsonObject){
    
    // Todo: get this synchronously:
    var allcontrolledterms = [];
    fs.readdirSync(CONTROLLED_TERM_INSTANCE_DIRECTORY).forEach((file) => {
        const controlledtermjson = require( path.join(CONTROLLED_TERM_INSTANCE_DIRECTORY, file));
        allcontrolledterms=allcontrolledterms.concat(controlledtermjson)
    })
    // Todo: What does all controlled terms look like?

    console.log('allcontrolledterms', allcontrolledterms)
    
    // Initialize variables for resulting jsons
    var dsresultforjson={}
    var dsvresultforjson={}
    var resultforhtml={}

    dsresultforjson ['https://openminds.ebrains.eu/vocab/fullName']=resultjsonObject.datasetinfo.dataset.fullName
    getKGids(resultjsonObject.contributors.dataset.authors,'ds','authors')
    getKGids(resultjsonObject.datasetinfo.datasetVersion.dataType,'dsv','dataType')
    if (resultjsonObject.datasetinfo.datasetVersion.embargo.embargo == true) {
        dsvresultforjson['https://openminds.ebrains.eu/vocab/accessibility'] = [{'@id':'https://kg.ebrains.eu/api/instances/897dc2af-405d-4df3-9152-6d9e5cae55d8'}]
        dsvresultforjson['https://openminds.ebrains.eu/vocab/releaseDate'] = resultjsonObject.datasetinfo.datasetVersion.embargo.releaseDate
    }
    //nees to be fixed//if (resultjsonObject.datasetinfo.datasetVersion.copyrightStatus.isCopyrighted == true) {}
    getKGids(resultjsonObject.datasetinfo.datasetVersion.license,'dsv','license')
    getKGids(resultjsonObject.dataset2info.datasetVersion.homepage,'dsv','homepage')
    dsvresultforjson ['https://openminds.ebrains.eu/vocab/supportChannel']=resultjsonObject.dataset2info.datasetVersion.supportChannel
    dsvresultforjson ['https://openminds.ebrains.eu/vocab/howToCite']=resultjsonObject.dataset2info.datasetVersion.howToCite
    getKGids(resultjsonObject.dataset2info.datasetVersion.inputData,'dsv','inputData')
    getKGids(resultjsonObject.dataset2info.datasetVersion.relatedPublication,'dsv','relatedPublication')
    if (resultjsonObject.funding.datasetVersion.funding) {
        getKGids(resultjsonObject.fundingAndAffiliation.datasetVersion.funding,'dsv','funding')  }
    getKGids(resultjsonObject.contributors.datasetVersion.otherContribution[0].contributor,'dsv','contributor')
    getKGids(resultjsonObject.contributors.datasetVersion.otherContribution[0].contributionType,'dsv','contributionType')
    getKGids(resultjsonObject.experiment.datasetVersion.experimentalApproach,'dsv','experimentalApproach')
    getKGids(resultjsonObject.experiment.datasetVersion.preparationDesign,'dsv','preparationDesign')
    getKGids(resultjsonObject.experiment.datasetVersion.technique,'dsv','technique')
    dsvresultforjson ['https://openminds.ebrains.eu/vocab/keyword']=resultjsonObject.experiment.datasetVersion.keyword
    getKGids(resultjsonObject.experiment.datasetVersion.studyTarget,'dsv','studyTarget')


    openMINDSDocuments = [dsresultforjson, dsvresultforjson];
    return openMINDSDocuments;

    //save the json files
    const DSjson = JSON.stringify(dsresultforjson);    
    var filePath = path.join(process.cwd(), 'DSresults.json');
    fs.writeFile(filePath, DSjson, (err) => {
        if (err) {
          console.error(err);
        }
    });
    const DSVjson = JSON.stringify(dsvresultforjson);
    var filePath = path.join(process.cwd(), 'DSVresults.json');
    fs.writeFile(filePath, DSVjson, (err) => {
        if (err) {
          console.error(err);
        }
    });



    //save the htmlfile
    let htmltable=''
    for(var i=0;i<Object.keys(resultforhtml).length;i++){
    htmltable=htmltable.concat('<tr><td>'+Object.keys(resultforhtml)[i]+'</td><td>'+getcellvalue(Object.values(resultforhtml)[i])+'</td></tr>')}
    const htmljson = JSON.stringify(resultforhtml);
    var filePath = path.join(process.cwd(), 'tohtml.json');
    const html = `
    <!DOCTYPE html>
    <HTML>
    <head>
    <title>Metadata Wizard JSON Curation</title>
    <style>
    * {
        box-sizing: border-box;
        font-family: Inter, Helvetica, Arial, sans-serif;
    }
    body {
        padding-top: 50px;
        padding-left: 25px;
        padding-right: 25px;
        background-color: white;
        text-align: center;                
    }
    p, h2{
        margin: 16px;
    }
    h2 {
        text-align: center;
        color: black;
    }
    th {
        background-color: beige;
        padding: 5px;
    }
    td {
        background-color: white;
        padding-left: 5px;
    }
    .container {
        border-radius: 5px;
        background-color: gainsboro;
        border: 1px solid #d5d5d5;
        padding: 25px;
        margin: auto;
        max-width: 1000px;
        max-height: 1000000px;
    }
    .wrapper {
        overflow: hidden;
        text-align: center;
        display: inline-block;
    }
    .gradient {
        background-image: linear-gradient(to right, #00A595, #00C959, #9CE142);
        min-height: 1vh;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        font-size: calc(10px + 2vmin);
        color: white;
    }
    </style>
    </head>
    <body>
    <h2>Processing of JSON files from the metadata wizard</h2>
    <div class="container" style="overflow: hidden; display: inline-block;">
    <p>Fields to be considered by the curator:</p>
    <table>
    <tr><th>Field</th><th>Value(s)</th></tr>`
    +htmltable+`
    </table>
    </div>
    </div>
    </body>
    </HTML>
    `;
    
       
    fs.writeFile('WizardtoKG.html', html, (err) => {
      if (err) throw err;
      console.log('HTML file created successfully!');
    });
    return [dsresultforjson,dsvresultforjson,resultforhtml]
    

    function getKGids(field,page,fieldname){  
        var allidentifiers=[]
        console.log('get kg id: fieldName', fieldname)
        if (Array.isArray(field)==true){field.forEach(
                element =>{
                    idforeach(field,fieldname,element,allidentifiers)
                })
        }
        else {
            idforeach(field,fieldname,field,allidentifiers)
        }
        if (allidentifiers.length!=0){
            if (page=='ds'){
                dsresultforjson['https://openminds.ebrains.eu/vocab/'+fieldname] = allidentifiers
            }
            else {
                dsvresultforjson['https://openminds.ebrains.eu/vocab/'+fieldname] = allidentifiers
            }
        }
    }

    function idforeach(field,fieldname,input,allidentifiers){
        if (fieldname=='authors'||fieldname=='contributor'){
            var identifier=getidentifiers(input.givenName+' '+input.familyName)
        }
        else if(fieldname=='studyTarget'){
            var identifier=getidentifiers(input.instance)
        }
        else{
            var identifier=getidentifiers(input)
        }
        if(typeof identifier=='string'){
            allidentifiers.push({'@id':identifier})
        }
        else{
            resultforhtml[fieldname] = field
        }
        return allidentifiers
    }

    function getidentifiers(input){
        if (typeof input=='string'){
            for (j in allcontrolledterms) {
                const lowercaseterms = Object.values(allcontrolledterms[j]).map(element => {
                    console.log('element',element)
                    return element.toLowerCase();
                });
                if (lowercaseterms.includes(input.toLowerCase())) {
                    return allcontrolledterms[j].identifier               
                }
            }
        }
    }
}

function getcellvalue(input) {
    if (typeof input == 'object') {
        return ((((JSON.stringify(input)).replace(/\s|\}|\[|\]|\"/g, "").replace(/\s|\,|\{/g, "<BR>")).replace(/\s|\:/g, ": ")).replace('<BR>',''))
    } else {
        return input;
    }
}



