const fs = require('fs');
const path = require('path');//&&added by Archana&&//
 
const controlledTerms = require('../../src/controlledTerms/studyTargetTermGroup.json');

function generateSchema(data) {

    // Inspired by rjsf playground : "schema dependencies"

    const schema = {
      type: "object",
      properties: {term: {title: "Study target category", type: "string", enum: Object.keys(data) } },
      required: ["term"],
      dependencies: {term: {oneOf: []}}
    };
  
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

  cascadeSchema = generateSchema(controlledTerms);
  const jsonStr = JSON.stringify(cascadeSchema, null, 2);

  saveFolder = process.cwd() + "/src" + "/schemas";
  
  const filePath = path.join(saveFolder, 'studyTargetCascadeSchema.json');
      
  fs.writeFile(filePath, jsonStr, (err) => {
      if (err) {
          console.error(err);
      } else {
          console.log('File with instances for "cascade" schema written successfully');
      }
  });