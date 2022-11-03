export const transformErrors = errors => {
    return errors.map(error => {
        if (error.name === "required") {
            error.message = "Please fill out this field."
        } else if (error.property === ".contributors" && error.name === "minItems") {
            error.message = "Please add at least one contributor."

        }
        return error;
    });
};