import { generateDocumentsFromFormData }  from '../formDataTranslator';

let testfunc = (formData) => {

    let dataset = formData;

    // flatten object to one level and take into account that there can be multiple properties containing objects with the same name

    let datasetFlattened = flattenFirstLevel(dataset);

    // let datasetFlattened = Object.keys(dataset).reduce(function (value, key) {
    //     return {...value, ...dataset[key]}; // flatten object
    //   }, []);

    // console.log('datasetFlattened', datasetFlattened)

    const res = generateDocumentsFromFormData( datasetFlattened );
    return res
}

function flattenFirstLevel(obj) {
    // potential useful function to remove the page hierarchy from the object

    let result = {};
    for (let key in obj) {
        // key is name of pages.
        // obj[key] is the object of the page


        for (let innerKey in obj[key]) {
            if (result.hasOwnProperty(innerKey)) {
                // Key is already part of results
                if(typeof obj[key][innerKey] === 'object' && obj[key][innerKey] !== null){
                    for(let innerInnerKey in obj[key][innerKey]){
                        result[innerKey][innerInnerKey] = obj[key][innerKey][innerInnerKey]
                    }
                } else {
                    result[innerKey] = obj[key][innerKey];
                }
            } else {
                // Key is not part of results yet
                if(typeof obj[key][innerKey] === 'object' && obj[key][innerKey] !== null){
                    result[innerKey] = {};
                    for(let innerInnerKey in obj[key][innerKey]){
                        result[innerKey][innerInnerKey] = obj[key][innerKey][innerInnerKey]
                    }
                } else {
                    result[innerKey] = obj[key][innerKey];
                }
            }
        }
    }
    return result;
}



export default testfunc