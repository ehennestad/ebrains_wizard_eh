const fs = require('fs');
const path = require('path');//&&added by Archana&&//
 
const controlledTerms = require('../../src/controlledTerms/studyTargetTermGroup.json');

function generateSchema(data) {
    const schema = {
      type: "object",
      properties: {term: {title: "Study target category", enum: Object.keys(data) } },
      allOf: []
    };
  
    Object.entries(data).forEach(([term, instances]) => {

      // if instances is empty
      if (instances.length !== 0) {
        schema.allOf.push({
          if: {
            properties: {
              term: {
                const: term
              }
            }
          },
          then: {
            properties: {
              instance: {
                title: term,
                type: "string",
                enum: instances.map( (instance) => (instance.name) )
                
              }
            },
            required: ["instance"]
          }
        })
      };
    });

    schema.allOf.push({
      required: ["term"]
    });
    
    return schema;
  }

  cascadeSchema = generateSchema(controlledTerms);
  const jsonStr = JSON.stringify(cascadeSchema, null, 2);

  saveFolder = process.cwd() + "/src" + "/schemas";
  
  const filePath = path.join(saveFolder, 'test.json');
      
  fs.writeFile(filePath, jsonStr, (err) => {
      if (err) {
          console.error(err);
      } else {
          console.log('File with instances for cascade schema written successfully');
      }
  });