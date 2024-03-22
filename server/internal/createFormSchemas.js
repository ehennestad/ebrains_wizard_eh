const path = require('path');
const fse = require('fs-extra');

const mkdirIfNotExists = require('./fscustom/mkDirIfNotExists');
const processSchemas = require('./processSchemas');

const $RefParser = require("@apidevtools/json-schema-ref-parser")
const dereferenceSchema = $RefParser.bundle;

const populateSchema = require('./schema-processor/populateSchema');

module.exports = assembleRJSFSchemas;

const ROOT_DIR = path.join(__dirname, '..', '..');//console.log('root dir: ', ROOT_DIR)

const CURRENT_WD = process.cwd();//console.log('current wd: ', CURRENT_WD)

async function assembleRJSFSchemas () {

    console.log('')
    console.log('Copying source schema to temporary folder for processing.')
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')

    // Copy all the schemas from the source_schemas folder to the temp folder
    const SCHEMA_SOURCE_DIRECTORY = path.join(ROOT_DIR, 'templates', 'source_schemas');
    const SCHEMA_TEMPORARY_DIRECTORY = path.join(ROOT_DIR, 'temporary', 'source_schemas');

    await mkdirIfNotExists(path.join(ROOT_DIR, 'temporary'));

    // Copy the directory
    try {
        await fse.copy(SCHEMA_SOURCE_DIRECTORY, SCHEMA_TEMPORARY_DIRECTORY)
        console.log('Copied source schemas to temporary folder');
    } catch (error) {
        console.error('Error copying source schemas:', error);
    }

    console.log('')
    console.log('Expanding definition schemas.')
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')

    // populate all definitions
    let sourceDirectory = path.join(SCHEMA_TEMPORARY_DIRECTORY, 'definitions');
    let targetDirectory = path.join(SCHEMA_TEMPORARY_DIRECTORY, 'definitions');

    await processSchemas(sourceDirectory, targetDirectory, populateSchema, 'Populated');
    console.log('Expanded definition schemas from templates.')

    // dereference all definitions
    console.log('\n')
    console.log('Dereferencing definition schemas.')
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
    targetDirectory = path.join(SCHEMA_TEMPORARY_DIRECTORY, 'dereferenced');
    await mkdirIfNotExists(targetDirectory);

    // Set the working directory to the directory of the schemas. This is 
    // important because the $RefParser.dereference function resolves relative paths 
    // relative to the working directory. If the working directory is not set to the
    // directory of the schemas, the relative paths in the schemas will not be correct
    process.chdir(sourceDirectory);
    await processSchemas(sourceDirectory, targetDirectory, dereferenceSchema, 'Dereferenced');

    // Populate all form schemas
    console.log('\n')
    console.log('Expanding form schemas.')
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
    sourceDirectory = SCHEMA_TEMPORARY_DIRECTORY;
    targetDirectory = SCHEMA_TEMPORARY_DIRECTORY;
    await processSchemas(sourceDirectory, targetDirectory, populateSchema, 'Populated');
    console.log('Expanded form schemas from templates.')
    
    // Dereference all form schemas
    console.log('\n')
    console.log('Dereferencing form schemas.')
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
    targetDirectory = path.join(ROOT_DIR, 'src', 'modules', 'Wizard', 'Schemas');
    process.chdir(sourceDirectory); 
    await processSchemas(sourceDirectory, targetDirectory, dereferenceSchema, 'Dereferenced');

    process.chdir(CURRENT_WD);
    // require here because the schema files are needed before the module can be properly imported
    const postProcessFundingSchema = require('./postProcessFundingSchema');
    await postProcessFundingSchema()

    // Resolve and include all external references for uischema
    console.log('\n')
    console.log('Resolving ui schema.')
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
    sourceDirectory = path.join(SCHEMA_TEMPORARY_DIRECTORY, 'uischema');
    targetDirectory = path.join(ROOT_DIR, 'src', 'schemas');
    await mkdirIfNotExists(targetDirectory);

    process.chdir(sourceDirectory); 
    await processSchemas(sourceDirectory, targetDirectory, $RefParser.dereference, 'Dereferenced');

    // Delete the temporary folder
    console.log('\n')
    console.log('Deleting temporary folder.')
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
    try {
        await fse.remove(SCHEMA_TEMPORARY_DIRECTORY)
        console.log('Deleted temporary folder');
    } catch (error) {
        console.error('Failed to delete temporary schema folder', error);
    }

    // Reset current working directory
    process.chdir(CURRENT_WD);
}
