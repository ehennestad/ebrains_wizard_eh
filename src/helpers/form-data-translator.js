//Why is this imported here? Shouldn't the controlled terms already be part of the form schema? Could the KG ID be placed in the formdata directly?
import * as experimentalApproachModule from '../controlledTerms/experimentalApproach.json'; 
import * as techniqueModule from '../controlledTerms/technique.json'

import {setProperty, setPropertyWithLinks, setPropertyWithLinksCreation, createDocument}
    from './openminds-document-generator';

const OPENMINDS_VOCAB = "https://openminds.ebrains.eu/vocab/";

// Rename to 
export const generateDocumentsFromDataset = dataset => {
    const documents = {ids: {}, keys: {}};
    generateDocuments(documents, dataset, null, () => null);
    return Object.values(documents.ids);
};

export const generateDocuments = (documents, dataset, studiedSpecimen, studiedSpecimenDocumentGenerator) =>  {
    const datasetDocId = createDatasetDocument(documents, dataset);
    const datasetDoc = documents.ids[datasetDocId];
    setPropertyWithLinksCreation(documents, datasetDoc, "studiedSpecimen", studiedSpecimen, studiedSpecimenDocumentGenerator);
};


const createDatasetDocument = (documents, source) => {
    
    const datasetId = createDocument(documents, "https://openminds.ebrains.eu/core/DatasetVersion", source.datasetinfo.datasetTitle);  // `${OPENMINDS_VOCAB}DatasetVersion`
    
    console.log('documents:', documents)
    
    const dataset = documents.ids[datasetId];

    // Page 1
    console.log('dataset',  dataset)
    setProperty(dataset, "fullName", source.datasetinfo.datasetTitle);
    setProperty(dataset, "description", source.datasetinfo.summary);
    setPropertyWithLinksCreation(documents, dataset, "custodian", source.custodian, createPersonDocument);
    setPropertyWithLinksCreation(documents, dataset, "contactperson", source.contactperson.contactinfo, createPersonDocument);

    // Page 2

    setProperty(dataset, "dataType", source.dataType);


    // setProperty(dataset, "dataCollectionFinished", source.datasetStatus.dataCollection);
    setProperty(dataset, "embargo", source.embargo.embargo);
    setProperty(dataset, "embargoEndDate", source.embargo.releaseDate);
    setPropertyWithLinks(dataset, "license", source.license);

    // Page 3


    // Page 4

    setPropertyWithLinksCreation(documents, dataset, "contributors", source.contributors, createPersonDocument);
    setPropertyWithLinksCreation(documents, dataset, "relatedPublication", source.publications, createRelatedPublicationDocument);

    // Page 5

    var experimentalApproachIDs = [];
    for(let key in source.datasetExpMetadata.experimentalApproach){
        experimentalApproachIDs.push(experimentalApproachModule.default.find(term=>term.name===source.datasetExpMetadata.experimentalApproach[key]).identifier);
    }
    setPropertyWithLinks(dataset, "experimentalApproach", experimentalApproachIDs);
    
    setPropertyWithLinks(dataset, "preparationDesign", source.datasetExpMetadata.preparationType);

    var techniqueIDs = [];
    for(let key in source.datasetExpMetadata.technique){
        techniqueIDs.push(techniqueModule.default.find(term=>term.name===source.datasetExpMetadata.technique[key]).identifier);
    }
    setPropertyWithLinks(dataset, "technique", techniqueIDs);
    
    setProperty(dataset, "keyword", source.datasetExpMetadata.keywords);
    
    return datasetId;
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