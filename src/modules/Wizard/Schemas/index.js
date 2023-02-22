
// Import the form json schemas. The json schemas are exported as default from the json files. The names of the json files in this index file should match those that are present in the templates/source_schema folder.

import * as generalSchemaModule from './general.json';
import * as dataset1Module from './datasetPart1.json';
import * as dataset2Module from './datasetPart2.json';
import * as experimentModule from './experiment.json';
import * as contributorsModule from './contributors.json';
import * as fundingModule from './funding.json';
import * as submissionSuccededModule from './submissionSucceededSchema.json';
import * as submissionFailedModule from './submissionFailedSchema.json';

export const generalSchema = generalSchemaModule.default;
export const dataset1Schema = dataset1Module.default;
export const experimentSchema = experimentModule.default;
export const contributorsSchema = contributorsModule.default;
export const fundingSchema = fundingModule.default;
export const dataset2Schema = dataset2Module.default;
export const submissionSuccededSchema = submissionSuccededModule.default;
export const submissionFailedSchema = submissionFailedModule.default;