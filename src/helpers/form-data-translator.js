//Why is this imported here? Shouldn't the controlled terms already be part of the form schema? Could the KG ID be placed in the formdata directly?
import * as experimentalApproachModule from '../controlledTerms/experimentalApproach.json'; 
import * as techniqueModule from '../controlledTerms/technique.json'

import {setProperty, setPropertyWithLinks, setPropertyWithLinksCreation, createDocument}
    from './openminds-document-generator';

const OPENMINDS_VOCAB = "https://openminds.ebrains.eu/vocab/";

// Call order
// generateDocumentsFromDataset ( dataset )
//   -> generateDocuments (documents, dataset, null, () => null);
//      -> createDatasetDocument
//         -> createDocument
//         -> setProperty
//         -> setPropertyWithLinksCreation 
//            -> createDocuments


// Rename to 
// This is the main function that is called from the wizard
export const generateDocumentsFromFormData = formData => {
    
    // Documents is an object array.
    // - ids is an object with the document id as key and the document as value
    // - keys is an object with the document type as key and an object with the document key as key and the document id as value

    let documents = generateDocuments(formData, null, () => null); //hmmm...
    return Object.values(documents.ids); // return array of documents
};

export const generateDocuments = (formData, studiedSpecimen, studiedSpecimenDocumentGenerator) =>  {
    const documents = {ids: {}, keys: {}};

    const datasetDocId = createDatasetVersionDocument(documents, formData);
    const datasetDoc = documents.ids[datasetDocId];
    setPropertyWithLinksCreation(documents, datasetDoc, "studiedSpecimen", studiedSpecimen, studiedSpecimenDocumentGenerator);

    return documents;
};


const createDatasetVersionDocument = (documents, source) => {
    
    const datasetDocumentId = createDocument(documents, "https://openminds.ebrains.eu/core/DatasetVersion", source.datasetVersion.fullName);  // `${OPENMINDS_VOCAB}DatasetVersion`
    
    console.log('documents:', documents)
    
    const dataset = documents.ids[datasetDocumentId];

    // Page 1
    console.log('dataset',  dataset)
    console.log('source',  source)

    for (let key in source.datasetVersion) {
        if (typeof source.datasetVersion[key] !== "object") {
            setProperty(dataset, key, source.datasetVersion[key]);
        } else {
            console.log('key', key)
            console.log('source.datasetVersion[key]', source.datasetVersion[key])
        }
    }

    // setProperty(dataset, "fullName", source.datasetVersion.fullName);
    // setProperty(dataset, "description", source.datasetinfo.summary);
    // setPropertyWithLinksCreation(documents, dataset, "custodian", source.custodian, createPersonDocument);
    // setPropertyWithLinksCreation(documents, dataset, "contactperson", source.contactperson.contactinfo, createPersonDocument);

    // // Page 2

    // setProperty(dataset, "dataType", source.dataType);


    // // setProperty(dataset, "dataCollectionFinished", source.datasetStatus.dataCollection);
    // setProperty(dataset, "embargo", source.embargo.embargo);
    // setProperty(dataset, "embargoEndDate", source.embargo.releaseDate);
    // setPropertyWithLinks(dataset, "license", source.license);

    // // Page 3


    // // Page 4

    // setPropertyWithLinksCreation(documents, dataset, "contributors", source.contributors, createPersonDocument);
    // setPropertyWithLinksCreation(documents, dataset, "relatedPublication", source.publications, createRelatedPublicationDocument);

    // // Page 5

    // var experimentalApproachIDs = [];
    // for(let key in source.datasetExpMetadata.experimentalApproach){
    //     experimentalApproachIDs.push(experimentalApproachModule.default.find(term=>term.name===source.datasetExpMetadata.experimentalApproach[key]).identifier);
    // }
    // setPropertyWithLinks(dataset, "experimentalApproach", experimentalApproachIDs);
    
    // setPropertyWithLinks(dataset, "preparationDesign", source.datasetVersion.preparationDesign);

    // var techniqueIDs = [];
    // for(let key in source.datasetExpMetadata.technique){
    //     techniqueIDs.push(techniqueModule.default.find(term=>term.name===source.datasetExpMetadata.technique[key]).identifier);
    // }
    // setPropertyWithLinks(dataset, "technique", techniqueIDs);
    
    // setProperty(dataset, "keyword", source.datasetExpMetadata.keywords);
    
    return datasetDocumentId;
};

const createPersonDocument = (documents, author) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Person`, `${author.lastName}-${author.firstName}`);
    const target = documents.ids[id];
    setProperty(target, "givenName", author.firstName);
    setProperty(target, "familyName", author.lastName);   
    setProperty(target, "affiliation", author.affiliation);  // needs to be mapped to organization
    setProperty(target, "email", author.email);  // contactInformation
    setProperty(target, "ORCID", author.orcid);  // digitalIdentifier
    return id;
};

const createRelatedPublicationDocument = (documents, relatedPublication) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}DOI`, relatedPublication.pubURL);
    const target = documents.ids[id];
    setProperty(target, "title", relatedPublication.pubTitle);
    setProperty(target, "identifier", relatedPublication.pubURL);
    return id;
  };