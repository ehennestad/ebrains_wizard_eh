export const transformErrors = errors => {
    return errors.map(error => {
        if (error.name === "required") {
            error.message = "Please fill out this field."
        }
        return error;
    });
};