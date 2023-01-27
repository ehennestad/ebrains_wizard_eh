import populateSchemaWithControlledTerms from './form-schema-processor';

// Import the form json schemas
import * as generalSchemaModule from '../modules/Wizard/Schemas/general.json';
import * as dataset1Module from '../modules/Wizard/Schemas/datasetPart1.json';
import * as dataset2Module from '../modules/Wizard/Schemas/datasetPart2.json';

import * as experimentModule from '../modules/Wizard/Schemas/experiment.json';
import * as contributorsModule from '../modules/Wizard/Schemas/contributors.json';

import * as fundingModule from '../modules/Wizard/Schemas/funding.json';
import * as submissionSuccededModule from '../modules/Wizard/Schemas/submissionSucceededSchema.json';
import * as submissionFailedModule from '../modules/Wizard/Schemas/submissionFailedSchema.json';


export const generalSchema = populateSchemaWithControlledTerms(generalSchemaModule.default);
export const datasetSchema = populateSchemaWithControlledTerms(dataset1Module.default);
export const experimentSchema = populateSchemaWithControlledTerms(experimentModule.default);
export const contributorsSchema = populateSchemaWithControlledTerms(contributorsModule.default);

export const fundingAndAffiliationSchema = fundingModule.default;
export const dataset2Schema = dataset2Module.default;
export const submissionSuccededSchema = submissionSuccededModule.default;
export const submissionFailedSchema = submissionFailedModule.default;

console.log('general:', generalSchema)

 