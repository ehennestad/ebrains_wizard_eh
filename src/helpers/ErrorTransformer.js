export const transformErrors = errors => {
    return errors.map(error => {

        // Replace message if no contributors are added
        if (error.property === ".dataset.authors" && error.name === "minItems") {
                error.message = "Please add at least one author."

        // Replace message if no excel file with subjects is uploaded
        } else if (error.property === ".subjectExpMetadata.uploadedExcelFile" && error.name === "required") {
            error.message = "Please fill out and upload the SubjectMetadata excel file. If you don't have subjects, select 'No' in the above field instead."
        
        // Replace message if user said there are subjects but didn't upload an excel file
        } else if (error.property === ".subjectExpMetadata.subjectsExist" && error.name === "const") {
            error.message = "If you have subjects, please upload a filled out excel file below. Otherwise, select 'No'"
        
        // Remove on-sensible error message (are these due to bug in rjsf?)
        } else if (error.property === ".subjectExpMetadata" && error.name === "oneOf") {
            error.message = ""
        } else if (error.property === ".datasetVersion.copyrightStatus" && error.name === "oneOf") {
            error.message = ""
        } else if (error.property === ".datasetVersion.copyrightStatus.isCopyrighted" && error.name === "const") {
            error.message = ""
        
        
        // Replace generic message for required fields
        } else if (error.name === "required") {
            error.message = "Please fill out this field."

        // Datasetversion specific errors@
        } else if (error.property === ".datasetVersion.homePage" && error.message ===  "should match format \"url\"") {
            error.message = "Should be a valid URL."

        } else if (error.property === ".datasetVersion.copyrightStatus.copyright.year" && error.message === "should match pattern \"([0-9]{4})\"") {
            error.message = "Should be a valid valid year, i.e a 4 digit number."
        }
        console.log(error)
        


        return error;
    });
};