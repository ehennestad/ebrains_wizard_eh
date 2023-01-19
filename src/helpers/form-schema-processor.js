

import * as experimentalApproachModule from '../controlledTerms/experimentalApproach.json'; 
import * as techniqueModule from '../controlledTerms/technique.json'
import * as preparationTypeModule from '../controlledTerms/preparationType.json'
import * as semanticDataTypeModule from '../controlledTerms/semanticDataType.json'
import * as datasetLicenseModule from '../controlledTerms/datasetLicense.json'; 
import * as contributionTypeModule from '../controlledTerms/contributionType.json'; 

const controlledTerms = {
  experimentalApproach: experimentalApproachModule.default,
  technique: techniqueModule.default,
  preparationType: preparationTypeModule.default,
  datasetLicense: datasetLicenseModule.default,
  semanticDataType: semanticDataTypeModule.default,
  contributionType: contributionTypeModule.default
};

const populateSchemaWithControlledTerms = schema => {
    if (typeof schema === "object") {
      switch (schema.type) {
        case "object":
          typeof schema.definitions === "object" && Object.values(schema.definitions).forEach(element => populateSchemaWithControlledTerms(element));
          typeof schema.properties === "object" && Object.values(schema.properties).forEach(element => populateSchemaWithControlledTerms(element));
          typeof schema.dependencies === "object" && Object.entries(schema.dependencies).forEach(([dependency, object]) => {
            Array.isArray(object.oneOf) && object.oneOf.forEach(dependent => {
              dependent.properties === "object" && Object.entries(dependent.properties)
                .filter(([key]) => key !== dependency)
                .forEach(([, element]) => populateSchemaWithControlledTerms(element));
            });
          });
          break;
        case "array":
          populateSchemaWithControlledTerms(schema.items);
          break;
        case "string":
          const controlledTerm = schema.controlledTerm && controlledTerms[schema.controlledTerm];
          if (controlledTerm) {
            if(schema.examples) {
              schema.examples = controlledTerm.map(term => term.name);
              schema.exampleIDs = controlledTerm.map(term => term.identifier);            
            } else {
              schema.enum = controlledTerm.map(term => term.identifier);
              schema.enumNames = controlledTerm.map(term => term.name);
            }
          }
          break;
        default:
          break;
      }
    }
    return schema;
  };
  
  export default populateSchemaWithControlledTerms