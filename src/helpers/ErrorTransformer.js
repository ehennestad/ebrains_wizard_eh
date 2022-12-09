export const transformErrors = errors => {
    return errors.map(error => {

        // Replace message if no contributors are added
        if (error.property === ".contributors" && error.name === "minItems") {
            error.message = "Please add at least one contributor."

        // Replace message if no excel file with subjects is uploaded
        } else if (error.property === ".subjectExpMetadata.uploadedExcelFile" && error.name === "required") {
            error.message = "Please fill out and upload the SubjectMetadata excel file. If you don't have subjects, select 'No' in the above field instead."
        
        // Replace message if user said there are subjects but didn't upload an excel file
        } else if (error.property === ".subjectExpMetadata.subjectsExist" && error.name === "const") {
            error.message = "If you have subjects, please upload a filled out excel file below. Otherwise, select 'No'"
        
        // Remove on-sensible error message
        } else if (error.property === ".subjectExpMetadata" && error.name === "oneOf") {
            error.message = ""
        
        // Replace generic message for required fields
        } else if (error.name === "required") {
            error.message = "Please fill out this field."
        }
        return error;
    });
};