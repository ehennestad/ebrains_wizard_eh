import populateSchemaWithControlledTerms from './form-schema-processor';

// Import the form json schemas
import * as generalSchemaModule from '../schemas/wizard-page-form-schemas/general.json';
import * as dataset1Module from '../schemas/wizard-page-form-schemas/datasetPart1.json';
import * as dataset2Module from '../schemas/wizard-page-form-schemas/datasetPart2.json';

import * as experimentModule from '../schemas/wizard-page-form-schemas/experiment.json';
import * as contributorsModule from '../schemas/wizard-page-form-schemas/contributors.json';

import * as fundingModule from '../schemas/wizard-page-form-schemas/funding.json';
import * as submissionSuccededModule from '../schemas/submissionSucceededSchema.json';
import * as submissionFailedModule from '../schemas/submissionFailedSchema.json';


export const generalSchema = populateSchemaWithControlledTerms(generalSchemaModule.default);
export const datasetSchema = populateSchemaWithControlledTerms(dataset1Module.default);
export const experimentSchema = populateSchemaWithControlledTerms(experimentModule.default);
export const contributorsSchema = populateSchemaWithControlledTerms(contributorsModule.default);

export const fundingAndAffiliationSchema = fundingModule.default;
export const dataset2Schema = dataset2Module.default;
export const submissionSuccededSchema = submissionSuccededModule.default;
export const submissionFailedSchema = submissionFailedModule.default;

console.log('general:', generalSchema)

 