
// Import the form json schemas
import * as generalSchemaModule from '../modules/Wizard/Schemas/general.json';
import * as dataset1Module from '../modules/Wizard/Schemas/datasetPart1.json';
import * as dataset2Module from '../modules/Wizard/Schemas/datasetPart2.json';
import * as experimentModule from '../modules/Wizard/Schemas/experiment.json';
import * as contributorsModule from '../modules/Wizard/Schemas/contributors.json';
import * as fundingModule from '../modules/Wizard/Schemas/funding.json';
import * as submissionSuccededModule from '../modules/Wizard/Schemas/submissionSucceededSchema.json';
import * as submissionFailedModule from '../modules/Wizard/Schemas/submissionFailedSchema.json';

export const generalSchema = generalSchemaModule.default;
export const dataset1Schema = dataset1Module.default;
export const experimentSchema = experimentModule.default;
export const contributorsSchema = contributorsModule.default;
export const fundingSchema = fundingModule.default;
export const dataset2Schema = dataset2Module.default;
export const submissionSuccededSchema = submissionSuccededModule.default;
export const submissionFailedSchema = submissionFailedModule.default;