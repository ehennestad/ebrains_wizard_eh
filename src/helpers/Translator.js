import * as experimentalApproachModule from '../controlledTerms/experimentalApproach.json'; 
import * as techniqueModule from '../controlledTerms/technique.json'

import _  from "lodash-uuid";

import {
  getSubjectStateEnum
} from './Wizard';

const OPENMINDS_VOCAB = "https://openminds.ebrains.eu/vocab/";
const EBRAINS_VOCAB = "https://kg.ebrains.eu/api/instances/";

const createDocument = (documents, type, key) => {
    if (key && documents.keys[type] && documents.keys[type][key]) {
        return documents.keys[type][key];
    }
    const id = `${EBRAINS_VOCAB}${_.uuid()}`;
    const doc = {
        "@id": id,
        "@type": [type]
    }
    documents.ids[id] = doc;
    if (key) {
        if (!documents.keys[type]) {
            documents.keys[type] = {};
        }
        documents.keys[type][key] = id;
    }
    return id;
};

const createDocuments = (documents, source, documentGenerator) => {
    if (source === null || source === undefined) {
        return [];
    }

    const sourceList = Array.isArray(source)?source:[source];
    if (!sourceList.length) {
        return [];
    }

    const ids = sourceList
        .filter(item => item !== null && item !== undefined)
        .map(item => documentGenerator(documents, item));
    return ids;
};

const setProperty = (object, name, value) => {
    if (Array.isArray(value)) {
        if (value.length) {
            object[`${OPENMINDS_VOCAB}${name}`] = value;
        }
    } else if (value !== null && value !== undefined && value !== "") {
        object[`${OPENMINDS_VOCAB}${name}`] = value;
    }
};

const setPropertyWithLinks = (object, name, value) => {
    if (Array.isArray(value)) {
        const values = value.map(id => ({"@id": id}));
        setProperty(object, name, values);
    } else if (value !== null && value !== undefined && value !== "") {
        setProperty(object, name, {"@id": value})
    }
};

const setPropertyWithLinksCreation = (documents, object, name, source, documentGenerator) => {
    const ids = createDocuments(documents, source, documentGenerator);
    setPropertyWithLinks(object, name, ids);
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

const createProtocolExecutionDocument = (documents, protocol) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}ProtocolExecution`, `${protocol.input}-${protocol.output}`);
    const target = documents.ids[id];
    setPropertyWithLinks(target, "input", protocol.input);
    setPropertyWithLinks(target, "output", protocol.output);
    return id;
};

const createQuantitativeValueEmbededDocument = quantitativeValue => {
  const embeded = {
    "@type": [
      `${OPENMINDS_VOCAB}QuantitativeValue`
    ]
  };
  setProperty(embeded, "value", quantitativeValue.value);
  setPropertyWithLinks(embeded, "unit", quantitativeValue.unit);
  return embeded;
};


const createSubjectStateDocument = (documents, studiedState) => {
    const subject = studiedState.subject;
    const key = getSubjectStateEnum(subject, studiedState);
    const id = createDocument(documents, `${OPENMINDS_VOCAB}SubjectState`, key);
    const target = documents.ids[id];
    setProperty(target, "age", createQuantitativeValueEmbededDocument(studiedState.age));
    setProperty(target, "weight", createQuantitativeValueEmbededDocument(studiedState.weight));
    return id;
};

const createSubjectGroupStateDocument = (documents, studiedState) => {
    const subject = studiedState.subject;
    const key = getSubjectStateEnum(subject, studiedState);
    const id = createDocument(documents, `${OPENMINDS_VOCAB}SubjectGroupState`, key);
    const target = documents.ids[id];
    setProperty(target, "age", createQuantitativeValueEmbededDocument(studiedState.age));
    setProperty(target, "weight", createQuantitativeValueEmbededDocument(studiedState.weight));
    return id;
};

const createTissueSampleStateDocument = (documents, studiedState) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}TissueSampleState`);
    const target = documents.ids[id];
    setProperty(target, "age", createQuantitativeValueEmbededDocument(studiedState.age));
    setProperty(target, "weight", createQuantitativeValueEmbededDocument(studiedState.weight));
    if (studiedState.subjectGroupState) {
        const subjectGroupStateVocab = `${OPENMINDS_VOCAB}SubjectGroupState`;
        const subjectGroupStateId = documents.keys[subjectGroupStateVocab] && documents.keys[subjectGroupStateVocab][studiedState.subjectGroupState];
        if (subjectGroupStateId) {
            const protocolExecution = {
                input: subjectGroupStateId,
                output: id
            };
            createProtocolExecutionDocument(documents, protocolExecution);
        }
    }
    return id;
};

const createTissueSampleCollectionStateDocument = (documents, studiedState) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}TissueSampleCollectionState`);
    const target = documents.ids[id];
    setProperty(target, "age", createQuantitativeValueEmbededDocument(studiedState.age));
    setProperty(target, "weight", createQuantitativeValueEmbededDocument(studiedState.weight));
    if (studiedState.subjectGroupState) {
        const subjectGroupStateVocab = `${OPENMINDS_VOCAB}SubjectGroupState`;
        const subjectGroupStateId = documents.keys[subjectGroupStateVocab] && documents.keys[subjectGroupStateVocab][studiedState.subjectGroupState];
        if (subjectGroupStateId) {
            const protocolExecution = {
                input: subjectGroupStateId,
                output: id
            };
            createProtocolExecutionDocument(documents, protocolExecution);
        }
    }
    return id;
};

const createSubjectDocument = (documents, source) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Subject`, source.lookupLabel);
    const target = documents.ids[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setPropertyWithLinks(target, "species", source.species);
    setPropertyWithLinks(target, "strain", source.strains);
    setPropertyWithLinks(target, "biologicalSex", source.biologicalSex);
    const studiedStates = source.studiedStates.map(state => ({...state, subject:source}));
    setPropertyWithLinksCreation(documents, target, "studiedState", studiedStates, createSubjectStateDocument);
    return id;
};

const createSubjectGroupDocument = (documents, source) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}SubjectGroup`, source.lookupLabel);
    const target = documents.ids[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setProperty(target, "quantity", source.quantity);
    setPropertyWithLinks(target, "species", source.species);
    setPropertyWithLinks(target, "strain", source.strains);
    setPropertyWithLinks(target, "biologicalSex", source.biologicalSex);
    setPropertyWithLinks(target, "phenotype", source.phenotype);
    const studiedStates = source.studiedStates.map(state => ({...state, subject:source}));
    setPropertyWithLinksCreation(documents, target, "studiedState", studiedStates, createSubjectGroupStateDocument);
    return id;
};

const createTissueSampleDocument = (documents, source) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}TissueSample`, source.lookupLabel);
    const target = documents.ids[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setPropertyWithLinks(target, "type", source.typesOfTheTissue);
    setPropertyWithLinks(target, "species", source.species);
    setPropertyWithLinks(target, "strain", source.strains);
    setPropertyWithLinks(target, "biologicalSex", source.biologicalSex);
    setPropertyWithLinks(target, "origin", source.origin);
    setPropertyWithLinksCreation(documents, target, "studiedState", source.studiedStates, createTissueSampleStateDocument);
    return id;
};

const createTissueSampleCollectionDocument = (documents, source) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}TissueSampleCollection`, source.lookupLabel);
    const target = documents.ids[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setProperty(target, "quantity", source.quantity);
    setPropertyWithLinks(target, "type", source.typesOfTheTissue);
    setPropertyWithLinks(target, "species", source.species);
    setPropertyWithLinks(target, "strain", source.strains);
    setPropertyWithLinks(target, "biologicalSex", source.biologicalSex);
    setPropertyWithLinks(target, "origin", source.origin);
    setPropertyWithLinksCreation(documents, target, "studiedState", source.studiedStates, createTissueSampleCollectionStateDocument);
    return id;
};

const createDigitalIdentifierDocument = (documents, doi) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}DigitalIdentifier`, doi);
  const target = documents.ids[id];
  setProperty(target, "identifier", doi);
  return id;
};

/* const createFullDocumentationDocument = (documents, fullDocumentation) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}FullDocumentation`, fullDocumentation);
  const target = documents.ids[id];
  setProperty(target, "name", fullDocumentation);
  return id;  
}

const createFundingDocument = (documents, funding) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}Funding`, funding);
  const target = documents.ids[id];
  setProperty(target, "awardTitle", funding);
  return id;  
}

const createRepositoryDocument = (documents, repository) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}FileRepository`, repository);
  const target = documents.ids[id];
  setProperty(target, "IRI", repository);
  return id;
};
 */
const createRelatedPublicationDocument = (documents, relatedPublication) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}DOI`, relatedPublication.pubURL);
  const target = documents.ids[id];
  setProperty(target, "title", relatedPublication.pubTitle);
  setProperty(target, "identifier", relatedPublication.pubURL);
  return id;
};

/* const createContributionTypeDocument = (documents, contributionType) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}ContributionType`, contributionType);
  const target = documents.ids[id];
  setProperty(target, "name", contributionType);
  return id;
};

const createOtherContributionDocument = (documents, otherContribution) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}OtherContribution`);
  const target = documents.ids[id];
  setPropertyWithLinksCreation(documents, target, "contributionType", otherContribution.contributionType, createContributionTypeDocument);
  setPropertyWithLinksCreation(documents, target, "contributor", otherContribution.contributor, createPersonDocument);
  return id;
};


//TODO: Check which is the most generic type 
const createInputDataDocument = (documents, inputData) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}InputData`, inputData);
    const target = documents.ids[id];
    setProperty(target, "identifier", inputData);
    return id;
  };
 */

const createDatasetDocument = (documents, source) => {
    const datasetId = createDocument(documents, "https://openminds.ebrains.eu/core/DatasetVersion", source.datasetinfo.datasetTitle);  // `${OPENMINDS_VOCAB}DatasetVersion`
    const dataset = documents.ids[datasetId];

    // Page 1

    setProperty(dataset, "fullName", source.datasetinfo.datasetTitle);
    setProperty(dataset, "description", source.datasetinfo.summary);
    setPropertyWithLinksCreation(documents, dataset, "custodian", source.custodian, createPersonDocument);
    setPropertyWithLinksCreation(documents, dataset, "contactperson", source.contactperson.contactinfo, createPersonDocument);

    // Page 2

    setProperty(dataset, "dataType", source.dataType);

    if(source.sharedAlready.sharedAlready === true) {
        setPropertyWithLinksCreation(documents, dataset, "digitalIdentifier", source.sharedAlready.DOI, createDigitalIdentifierDocument);
    }

    if(source.versions.versions!=="no"){
        setProperty(dataset, "alternativeVersion", source.versions.versionDOI);            
        if(source.versions.versions==="updated"){
            setProperty(dataset, "versionInnovation", source.versions.versionInnovation);            
        }
    }

    setProperty(dataset, "dataCollectionFinished", source.datasetStatus.dataCollection);
    setProperty(dataset, "embargo", source.embargo.embargo);
    setProperty(dataset, "embargoEndDate", source.embargo.releaseDate);
    setPropertyWithLinks(dataset, "license", source.license);

    // Page 3

    switch(source.affiliation.affiliation){
        case "HBP internal":
            setProperty(dataset, "HBPtaskID", source.affiliation.taskID);
            setProperty(dataset, "HBPcomponentID", source.affiliation.component);
            setProperty(dataset, "HBPfundingPhase", [source.affiliation.fundingPhase]);
            break;
        case "partnering project":
            setProperty(dataset, "partneringProject", source.affiliation.partneringProject);
            break;
        case "external":
            setProperty(dataset, "Funder", source.affiliation.funder);
            setProperty(dataset, "GrantID", source.affiliation.grantID);
            break;
        default:
            break;
    }

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

const generateDocuments = (documents, dataset, studiedSpecimen, studiedSpecimenDocumentGenerator) =>  {
    const datasetDocId = createDatasetDocument(documents, dataset);
    const datasetDoc = documents.ids[datasetDocId];
    setPropertyWithLinksCreation(documents, datasetDoc, "studiedSpecimen", studiedSpecimen, studiedSpecimenDocumentGenerator);
};
    
export const generateDocumentsFromDataset = dataset => {
    const documents = {ids: {}, keys: {}};
    generateDocuments(documents, dataset, null, () => null);
    return Object.values(documents.ids);
};
    
export const generateDocumentsFromDatasetAndSubjectGroups = (dataset, subjectsGroups) => {
    const documents = {ids: {}, keys: {}};
    generateDocuments(documents, dataset, subjectsGroups, createSubjectGroupDocument);
    return Object.values(documents.ids);
};
    
export const generateDocumentsFromDatasetAndSubjects = (dataset, subjects) => {
    const documents = {ids: {}, keys: {}};
    generateDocuments(documents, dataset, subjects, createSubjectDocument);
    return Object.values(documents.ids);
};
    
export const generateDocumentsFromDatasetAndTissueSampleCollections = (dataset, subjectGroups, tissueSampleCollections) => {
    const documents = {ids: {}, keys: {}};
    createDocuments(documents, subjectGroups, createSubjectGroupDocument);
    generateDocuments(documents, dataset, tissueSampleCollections, createTissueSampleCollectionDocument);
    return Object.values(documents.ids);
}; 

export const generateDocumentsFromDatasetAndArtificialTissueSampleCollections = (dataset, tissueSampleCollections) => {
    const documents = {ids: {}, keys: {}};
    generateDocuments(documents, dataset, tissueSampleCollections, createTissueSampleCollectionDocument);
    return Object.values(documents.ids);
};

export const generateDocumentsFromDatasetAndTissueSamples = (dataset, subjectGroups, tissueSamples) => {
    const documents = {ids: {}, keys: {}};
    createDocuments(documents, subjectGroups, createSubjectGroupDocument);
    generateDocuments(documents, dataset, tissueSamples, createTissueSampleDocument);
    return Object.values(documents.ids);
};

export const generateDocumentsFromDatasetAndArtificialTissueSamples = (dataset, tissueSamples) => {
    const documents = {ids: {}, keys: {}};
    generateDocuments(documents, dataset, tissueSamples, createTissueSampleDocument);
    return Object.values(documents.ids);
};
