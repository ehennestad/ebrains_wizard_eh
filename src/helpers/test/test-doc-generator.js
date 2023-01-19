import { generateDocumentsFromDataset }  from '../form-data-translator';
import formData from './ebrains_wizard_metadata.json';

let testfunc = () => {
    console.log(formData[0]);
    let dataset = formData[0];
    let datasetFlattened = Object.keys(dataset).reduce(function (value, key) {
        return {...value, ...dataset[key]}; // flatten object
      }, []);

    generateDocumentsFromDataset(datasetFlattened)

}

export default testfunc