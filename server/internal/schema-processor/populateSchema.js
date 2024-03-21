// This module contains functions for populating schemas with controlled 
// terms instances and other instances from the knowledge graph.


const path = require('path');
const fs = require('fs');

const {importControlledTerms, importInstances} = require('../../kg-util/getControlledTerms');

// Todo: import on demand
const controlledTermNames = [
    'experimentalApproach', 
    'technique', 
    'preparationType', 
    'datasetLicense', 
    'semanticDataType', 
    'contributionType' ];


// Object with all controlled terms as key value pairs.
const controlledTerms = importControlledTerms(controlledTermNames)
const instances = importInstances(["Person", "Organization"]);

const templatesDirectory = path.join(__dirname, '..', '..', '..', 'templates');
const TEXT_MODULE_DIRECTORY = path.join(templatesDirectory, 'text_modules');

// rename to buildJsonFromTemplate
module.exports = populateSchema;

async function populateSchema(schema) {

    if (typeof schema === "object") {
        switch (schema.type) {
            case "object":
                typeof schema.definitions === "object" && Object.values(schema.definitions).forEach(element => populateSchema(element));
                typeof schema.properties === "object" && Object.values(schema.properties).forEach(element => populateSchema(element));
                typeof schema.dependencies === "object" && Object.entries(schema.dependencies).forEach(([dependency, object]) => {
                    Array.isArray(object.oneOf) && object.oneOf.forEach(dependent => {
                    dependent.properties === "object" && Object.entries(dependent.properties)
                        .filter(([key]) => key !== dependency)
                        .forEach(([, element]) => populateSchema(element));
                    });
                });
                if (schema.controlledTermSet) {
                    const data = importControlledTerms(schema.controlledTermSet)
                    schema = addControlledTermSetToSchema(schema, data);

                } else if (schema.instanceTypeSet) {
                    let data = importInstances(schema.instanceTypeSet);
                    // create name for each object array in the data
                    data = convertPropertiesToName(data);
                    schema = addControlledTermSetToSchema(schema, data);

                } else if (schema.schemaTypeSet) {
                    let data = await importSchemas(schema.schemaTypeSet);
                    // create name for each object array in the data
                    //data = convertPropertiesToName(data);
                    schema = addReferencedSchemas(schema, data);
                }
                break;
            case "array":
                populateSchema(schema.items);
                break;
            case "string":
                const controlledTerm = schema.controlledTerm && controlledTerms[schema.controlledTerm];
                if (schema.controlledTerm) {
                    schema = addControlledTermInstancesToSchema(schema);
                } else if (schema.keywordSet) {
                    const data = importControlledTerms(schema.keywordSet)
                    schema = addKeywordSetSetToSchema(schema, data);
                } else if (schema.textModule) {
                    schema.text = getHtmlString( schema.textModule );
                } else if (schema.openMindsType) {
                    addOpenMindsInstanceToSchema(schema)
                }

                break;
            default:
                break;
        }
    }
    return schema;
};

function addControlledTermSetToSchema(schema, data) {
    // Inspired by rjsf playground : "schema dependencies"

    // This function takes a schema object and adds a controlled term set to it. 
    // The controlled term set is a list of controlled terms that can be selected 
    // from. When a term is selected from the list, the schema is updated to 
    // include the properties of the selected term. In the form, the user first 
    // selects the term from a dropdown and a new dropdown appears with the 
    // instances of the selected term. The user then selects an instance from the 
    // new dropdown.

    // Note: changed to also work for general kg instances
    
    schema.type = "object";
    schema.properties = {term: {title: schema.subtitle, type: "string", enum: Object.keys(data) } };
    // Set a default value for the enum options
    if (schema.defaultInstanceType) {
        schema.properties.term.default = schema.defaultInstanceType;
    }

    schema.required = ["term"];
    schema.dependencies = {term: {oneOf: []}};
    
    Object.entries(data).forEach(([term, instances]) => {

        // if instances is empty
        if (instances.length !== 0) {
        schema.dependencies.term.oneOf.push( {
            "properties": {
            "term": {
                "enum": [
                term
                ]
            },
            instance: {
                "title": term, 
                "type": "string",
                "examples": instances.map( (instance) => (instance.name) )
                //"enum": instances.map( (instance) => (instance.name) )
            }
            },
            "required": [
            "instance"
            ]
        })
        };
    });
    
    return schema;
}


function addKeywordSetSetToSchema(schema, data) {

    console.log('here')
    // flatten the controlled term set to a list of instances
    let controlledTermInstances = [];
    Object.values(data).forEach( instances => {
        controlledTermInstances = controlledTermInstances.concat(instances);
    });

    if (schema.examples) {
        schema.examples = controlledTermInstances.map(term => term.name);
        schema.exampleIDs = controlledTermInstances.map(term => term.identifier);
    }
}

function addReferencedSchemas(schema, data) {
    // Inspired by rjsf playground : "schema dependencies"

    // This function takes a schema object and adds a controlled term set to it. 
    // The controlled term set is a list of controlled terms that can be selected 
    // from. When a term is selected from the list, the schema is updated to 
    // include the properties of the selected term. In the form, the user first 
    // selects the term from a dropdown and a new dropdown appears with the 
    // instances of the selected term. The user then selects an instance from the 
    // new dropdown.

    // Note: changed to also work for general kg instances
    
    schema.type = "object";
    schema.properties = {term: {title: schema.subtitle, type: "string", enum: Object.keys(data) } };
    
    // Set a default value for the enum options
    if (schema.defaultInstanceType) {
        schema.properties.term.default = schema.defaultInstanceType;
    }

    schema.required = ["term"];
    schema.dependencies = {term: {oneOf: []}};
    
    Object.entries(data).forEach(([term, instance]) => {

        // if instances is empty
        if (instance.length !== 0) {
        schema.dependencies.term.oneOf.push( {
            "properties": {
            "term": {
                "enum": [
                term
                ]
            },
            instance
            },
            "required": [
            "instance"
            ]
        })
        };
    });
    
    return schema;
}

function addControlledTermInstancesToSchema (schema) {
    
    let controlledTermInstances = controlledTerms[schema.controlledTerm];
    
    if (schema.examples) {
        schema.examples = controlledTermInstances.map(term => term.name);
        schema.exampleIDs = controlledTermInstances.map(term => term.identifier);
        schema.pattern = "^(" + schema.examples.join("|") + ")$";
    } else {
        schema.enum = controlledTermInstances.map(term => term.identifier);
        schema.enumNames = controlledTermInstances.map(term => term.name);
    }
    return schema;
}

function convertPropertiesToName (data) {

    // for each property in data, create a new object with a name property
    let newData = {};
    Object.entries(data).forEach(([key, value]) => {
        newData[key] = value.map( instance => {
            instance.name = instance.fullName || instance.familyName + ", " + instance.givenName;
            return instance;
        });
    });
    return newData;
}

function addOpenMindsInstanceToSchema (formSchema) {
    let instanceList = instances[formSchema.openMindsType];

    const formatObjectForDisplay = (instance) => {
        const propertyNames = formSchema.instanceProperties
        let formattedString = formSchema.labelTemplate

        for (let i = 0; i < propertyNames.length; i++) {
            const propName = propertyNames[i];
            const propValue = instance[propName];
        
            formattedString = formattedString.replace(new RegExp(`\\$\\{${propName}\\}`, 'g'), propValue);
        }
        return formattedString
    }
    
    formSchema.examples = instanceList.map( term => formatObjectForDisplay(term));
    formSchema.exampleIDs = instanceList.map(term => term.identifier);
    formSchema.pattern = "^(" + formSchema.examples.join("|") + ")$";   
}

async function importSchemas (schemaTypeSet) {

    const sourcePath = path.join(__dirname, '..', '..', '..', 'temporary', 'source_schemas', 'dereferenced');
    
    const numInstances = schemaTypeSet.length;

    const filePaths = Array.from({ length: numInstances }, (_, i) => {
        return path.join(sourcePath, schemaTypeSet[i].toLowerCase()+'.json');
    })
    
    let jsonObject = {};
    for (let i = 0; i < filePaths.length; i++) {
        let thisFilepath = filePaths[i];
        let thisInstance = schemaTypeSet[i];
        let jsonContent = JSON.parse(fs.readFileSync(thisFilepath));
        jsonObject[thisInstance] = jsonContent;
    };
    return jsonObject;
}

// Todo: implement this.
function addTextModuleToSchema (schema) {

    if (typeof schema === "object" && schema.type === "string") {
        const hasTextModule = schema.textModule;
        if (hasTextModule) {
            schema.text = getHtmlString( schema.textModule );
        }
    }
    return schema;
};

function getHtmlString (htmlFileName) {
    // Read a html file from the textModules folder and return it as a string 
    // without any spaces or newlines.
    
    const sourcePath = path.join(TEXT_MODULE_DIRECTORY, htmlFileName+'.html');
    let htmlString = fs.readFileSync(sourcePath, "utf-8");

    // Remove all spaces before closing tags if they are not inline elements
    htmlString = htmlString.replace(/\n\s+</g,"\n<");

    // Remove all newlines and tabs
    htmlString = htmlString.replace(/(\n\s+|\r\n|\n|\r|\t)/gm, "");

    // Remove all spaces between tags
    htmlString = htmlString.replace(/>\s+</g,"><");


    // Remove all spaces before closing tags
    //htmlString = htmlString.replace(/\n\s+</g,"\n<");

    // Remove all spaces after opening tags
    //htmlString = htmlString.replace(/>\s+/g,">");

    return htmlString
}
