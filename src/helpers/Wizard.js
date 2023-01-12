import * as generalSchemaModule from '../schemas/generalSchema.json';
import * as datasetSchemaModule from '../schemas/datasetSchema.json';
import * as experimentSchemaModule from '../schemas/experimentSchema.json';
import * as contributorsModule from '../schemas/contributors.json';

import * as uiSchemaModule from '../schemas/uiSchema.json'

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

export const uiSchema = uiSchemaModule.default;

const getUnitOfMeasurementLabel = identifier => {
  const item = controlledTerms.unitOfMeasurement.find(e => e.identifier === identifier);
  return item?item.name:"";
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

export const getSubjectStateEnum = (subject, subjectState) => `${subject.lookupLabel} [${subjectState.age.value}${getUnitOfMeasurementLabel(subjectState.age.unit)} - ${subjectState.weight.value}${getUnitOfMeasurementLabel(subjectState.weight.unit)}]`;

// const getSubjectEnumList =  subjects => {
//   return subjects.reduce((acc, subject) => subject.studiedStates.reduce((acc2, state) => {
//     acc2.push(getSubjectStateEnum(subject, state));
//     return acc2;
//   }, acc), []);
// };

export const generalSchema = populateSchemaWithControlledTerms(generalSchemaModule.default);
export const datasetSchema = populateSchemaWithControlledTerms(datasetSchemaModule.default);
export const experimentSchema = populateSchemaWithControlledTerms(experimentSchemaModule.default);
export const contributorsSchema = populateSchemaWithControlledTerms(contributorsModule.default);

// export const subjectSchema = populateSchemaWithControlledTerms(subjectSchemaModule.default);
// export const tissueSampleSchema = populateSchemaWithControlledTerms(tissueSampleSchemaModule.default);

export const areSubjectsGrouped = dataset => !dataset || !dataset.individualSubjects;

export const areTissueSamplesGrouped = dataset => !dataset || !dataset.individualTissueSamples;

export const getNumberOfSubjects = dataset => {
  const number = dataset?Number(dataset.numberOfSubjects):NaN;
  return isNaN(number)?0:number;
};

export const getNumberOfTissueSamples = dataset => {
  const number = dataset?Number(dataset.numberOfTissueSamples):NaN;
  return isNaN(number)?0:number;
};

export const getStudyTopic = dataset => dataset?dataset.studyTopic:undefined;

export const generateItemsFromTemplate = (template, size) => [...Array(size).keys()].map(() => JSON.parse(JSON.stringify(template)));
