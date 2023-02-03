export const transformErrors = errors => {
    return errors.map(error => {

        // Replace message for array where at least one item is required
        if (error.message === "must NOT have fewer than 1 items" && error.name === "minItems") {

            if  (error.property === ".dataset.authors") {
                error.message = "Please add at least one author."
            } else if (error.property === ".datasetVersion.dataType") {
                error.message = "Please select at least one item."
            } else if (error.property === ".datasetVersion.experimentalApproach") {
                error.message = "Please add at least one experimental approach."
            } else if (error.property === ".datasetVersion.technique") {
                error.message = "Please add at least one technique."
            }

        } else if (error.property === ".datasetVersion.dataType" && error.name === "minItems") {
            error.message = "Please select at least one item."

        // Replace message if no excel file with subjects is uploaded
        } else if (error.property === ".subjectExpMetadata.uploadedExcelFile" && error.name === "required") {
            error.message = "Please fill out and upload the SubjectMetadata excel file. If you don't have subjects, select 'No' in the above field instead."
        
        // Replace message if user said there are subjects but didn't upload an excel file
        } else if (error.property === ".subjectExpMetadata.subjectsExist" && error.name === "const") {
            error.message = "If you have subjects, please upload a filled out excel file below. Otherwise, select 'No'"
        
        } else if (error.message === "must match format \"email\"") {
            error.message = "Please enter a valid email address."

        } else if (error.message === "must match format \"url\"") {
            error.message = "Please enter a valid URL."

        } else if (error.property.includes(".datasetVersion.relatedPublication")) {
            error.message = "Please enter a valid DOI according to the example above."
            
        // Remove non-sensible error message (are these due to bug in rjsf?)
        } else if (error.name === "oneOf") {
            if (error.property === ".subjectExpMetadata" ||  error.property === ".datasetVersion.copyrightStatus" || error.property.includes(".authors") || error.property.includes(".contributor") ) {
                error.message = "";
            }

        } else if (error.name === "const") {
            if (error.property === ".datasetVersion.copyrightStatus.isCopyrighted" || error.property.includes(".authors") ||  error.property.includes(".contributor") ) {
                error.message = "";
            }


        } else if (error.name === "pattern") {
            if (error.property.includes(".contributionType") ||
                error.property.includes(".experimentalApproach") ||
                error.property.includes(".technique") ) {
                error.message = "Please select one of the values from the list.";
            }

        } else if ( error.property.includes(".studyTarget") ) {
            if (error.name === "if") {
                error.message = "";
            } else if (error.name === "enum") {
                error.message = "";
            } else if (error.name === "required") {
                console.log(error.property)
                if ( error.property.includes(".studyTarget") && error.property.includes(".instance") ) {
                    error.message = "";
                } else {
                    error.message = "Please select one of the values from the list.";
                }
            }

        // Replace generic message for required fields
        } else if (error.name === "required") {
            error.message = "Please fill out this field."

        // Datasetversion specific errors@
        } else if (error.property === ".datasetVersion.homePage" && error.message ===  "should match format \"url\"") {
            error.message = "Should be a valid URL."

        } else if (error.property === ".datasetVersion.copyrightStatus.copyright.year" && error.message === "must match pattern \"([0-9]{4})\"") {
            error.message = "Should be a valid valid year, i.e a 4 digit number."
        }

        console.log(error)
        
        return error;
    });
};