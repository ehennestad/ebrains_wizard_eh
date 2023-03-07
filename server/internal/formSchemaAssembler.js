const path = require('path');
const fs = require('fs');

const {importControlledTerms} = require('../kg-util/getControlledTerms');

// Todo: import on demand
const controlledTermNames = [
    'experimentalApproach', 
    'technique', 
    'preparationType', 
    'datasetLicense', 
    'semanticDataType', 
    'contributionType' ];

const templatesDirectory = path.join(__dirname, '..', '..', 'templates');

const TEXT_MODULE_DIRECTORY = path.join(templatesDirectory, 'text_modules');
const SCHEMA_SOURCE_DIRECTORY = path.join(templatesDirectory, 'source_schemas');
const SCHEMA_OUTPUT_DIRECTORY = path.join(__dirname, '..', '..', 'src', 'modules', 'Wizard', 'Schemas');

fs.mkdir(SCHEMA_OUTPUT_DIRECTORY, (err) => {
    if (err) {
        if (err.code === 'EEXIST') {
            console.log("Directory already exists.");
        } else {
            console.log(err);
        }
    } else {
        console.log("New directory successfully created.");
    }
});

//assembleRJSFSchemas()
// rename to buildJsonFromTemplate
module.exports = assembleRJSFSchemas;

function assembleRJSFSchemas () {

    // Object with all controlled terms as key value pairs.
    const controlledTerms = importControlledTerms(controlledTermNames)
    
    const populateSchema = schema => {

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
                        schema = addControlledTermSetToSchema(schema);
                    }
                    break;
                case "array":
                    populateSchema(schema.items);
                    break;
                case "string":
                    const controlledTerm = schema.controlledTerm && controlledTerms[schema.controlledTerm];
                    if (schema.controlledTerm) {
                        schema = addControlledTermInstancesToSchema(schema);
                    } else if (schema.textModule) {
                        schema.text = getHtmlString( schema.textModule );
                    }
                
                    break;
                default:
                    break;
            }
        }
        return schema;
    };

    function addControlledTermSetToSchema(schema) {
        // Inspired by rjsf playground : "schema dependencies"
    
        // This function takes a schema object and adds a controlled term set to it. 
        // The controlled term set is a list of controlled terms that can be selected 
        // from. When a term is selected from the list, the schema is updated to 
        // include the properties of the selected term. In the form, the user first 
        // selects the term from a dropdown and a new dropdown appears with the 
        // instances of the selected term. The user then selects an instance from the 
        // new dropdown.
    
        const data = importControlledTerms(schema.controlledTermSet)
    
        schema.type = "object";
        schema.properties = {term: {title: schema.subtitle, type: "string", enum: Object.keys(data) } };
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
                  "enum": instances.map( (instance) => (instance.name) )
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

    return new Promise( (resolve, reject) => {
        
        // Get all the schema files in the src folder
        fs.readdir(SCHEMA_SOURCE_DIRECTORY, (err, schemaFiles) => {
            
            if (err) {
                reject(err);
            }
            
            var numCompletedFiles = 0;

            // For each schema file, read the file and parse it to a JSON object.
            schemaFiles.forEach( schemaFile => {
                var thisSchemaFilepath = path.join(SCHEMA_SOURCE_DIRECTORY, schemaFile);
                fs.readFile(thisSchemaFilepath, (err, jsonStr) => {
                    if (err) {
                        reject(err);
                    }
                    const schemaObject = JSON.parse(jsonStr);
                    const populatedSchema = populateSchema(schemaObject);
                    const targetFilepath = path.join(SCHEMA_OUTPUT_DIRECTORY, schemaFile);
                    fs.writeFile(targetFilepath , JSON.stringify(populatedSchema, null, 2), (err) => {
                        if (err) {
                            reject(err);
                        }
                        numCompletedFiles++;
                        if (numCompletedFiles === schemaFiles.length) {
                            resolve();
                        }
                    })
                })
            })
        })
    })


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
