const fsp = require('fs').promises;
const path = require('path');

module.exports = processSchemas;

async function processSchemas(sourceDirectory, targetDirectory, processingFunction, processingTitle = 'Processed') {
    try {
        // List all files in the source directory
        const schemaFiles = await fsp.readdir(sourceDirectory);

        // Remove folders from the list of files
        const schemaStats = await Promise.all(schemaFiles.map(file =>
            fsp.lstat(path.join(sourceDirectory, file))
                .then(stats => ({ file, stats }))
        ));
        const schemaFilesToProcess = schemaStats.filter(({ stats }) => stats.isFile()).map(({ file }) => file);

        // Process each schema file and write the result to the target directory
        await Promise.all(schemaFilesToProcess.map(async (schemaFile) => {
            const thisSchemaFilepath = path.join(sourceDirectory, schemaFile);
            const jsonStr = await fsp.readFile(thisSchemaFilepath, 'utf8');
            const schemaObject = JSON.parse(jsonStr);
            const processedSchema = await processingFunction(schemaObject);
            const targetFilepath = path.join(targetDirectory, schemaFile);
            await fsp.writeFile(targetFilepath, JSON.stringify(processedSchema, null, 2));
            console.log(`${processingTitle} schema file: ${schemaFile}`);
        }));

        console.log(`All schema files ${processingTitle.toLowerCase()} successfully`);
    } catch (err) {
        console.error('Error processing schema files:', err);
    }
}