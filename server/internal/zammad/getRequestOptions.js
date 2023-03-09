
// Function to assemble request options including header with token authorization
 function getRequestOptions() {
    let token = "O0gJQ6t25hWptjbbVLBDtSfI1EKv_vMsq0o3sv5ibgIY5OqEGppA5qT8C3ivWnnY";
    token = "9V9w9-0cgV7uTbb4RG0FDvgdfSyYMSgGOUIP7rzcxC3zwksmXHYBVqFA7_xVH4i7";
    const requestHeader = { 
        Accept: "*/*", 
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
    };
        
    const requestOptions = {headers: requestHeader};
    return requestOptions;
}

module.exports = getRequestOptions