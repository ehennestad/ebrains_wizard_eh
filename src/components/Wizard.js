import React from 'react';
import axios from 'axios';

import GeneralWizard from './Wizard/GeneralWizard';
import DatasetWizard from './Wizard/DatasetWizard';
import FundingAndAffiliationWizard from './Wizard/FundingAndAffiliationWizard';
import ContributorsWizard from './Wizard/ContributorsWizard';
import ExperimentWizard from './Wizard/ExperimentWizard.js';
import SubmissionCompletedWizard from './Wizard/SubmissionCompletedWizard.js';
import SubmissionFailedWizard from './Wizard/SubmissionFailedWizard.js';

//import SubjectGroupWizard from './Wizard/SubjectGroupWizard';
//import SubjectTemplateWizard from './Wizard/SubjectTemplateWizard';
//import SubjectsWizard from './Wizard/SubjectsWizard';
//import TissueSampleCollectionWizard from './Wizard/TissueSampleCollectionWizard';
//import TissueSampleTemplateWizard from './Wizard/TissueSampleTemplateWizard';
//import TissueSamplesWizard from './Wizard/TissueSamplesWizard';
import Result from './Result';

import { 
  generateDocumentsFromDataset, 
}  from '../helpers/Translator';

import {
  generalSchema,
  datasetSchema,
  experimentSchema,
  areSubjectsGrouped,
  areTissueSamplesGrouped,
  getStudyTopic,
  uiSchema
} from '../helpers/Wizard';

import * as fundingAndAffiliationModule from '../schemas/fundingAndAffiliation.json';
import * as contributorsModule from '../schemas/contributors.json';
import * as submissionModule from '../schemas/submissionSchema.json';
import * as submissionFailedModule from '../schemas/submissionFailedSchema.json';

const fundingAndAffiliationSchema = fundingAndAffiliationModule.default;
const contributorsSchema = contributorsModule.default;
const submissionSchema = submissionModule.default;
const submissionFailedSchema = submissionFailedModule.default;


const STUDY_TOPIC_SUBJECT_VALUE = "Subject";
const STUDY_TOPIC_TISSUE_SAMPLE_VALUE = "Tissue sample";
const STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE = "Artificial tissue sample";

const WIZARD_STEP_GENERAL = "WIZARD_STEP_GENERAL";
const WIZARD_STEP_DATASET = "WIZARD_STEP_DATASET";
const WIZARD_STEP_FUNDING_AND_AFFILIATION = "WIZARD_STEP_FUNDING_AND_AFFILIATION";
const WIZARD_STEP_CONTRIBUTORS = "WIZARD_STEP_CONTRIBUTORS";
const WIZARD_STEP_EXPERIMENT = "WIZARD_STEP_EXPERIMENT";
const WIZARD_STEP_SUBJECT_GROUP = "WIZARD_STEP_SUBJECT_GROUP";
const WIZARD_STEP_SUBJECT_TEMPLATE = "WIZARD_STEP_SUBJECT_TEMPLATE";
const WIZARD_STEP_SUBJECTS = "WIZARD_STEP_SUBJECTS";
const WIZARD_STEP_TISSUE_SAMPLE_GROUP = "WIZARD_STEP_TISSUE_SAMPLE_GROUP";
const WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE = "WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE";
const WIZARD_STEP_TISSUE_SAMPLES = "WIZARD_STEP_TISSUE_SAMPLES";
const WIZARD_END = "WIZARD_END";
const WIZARD_FAILED = "WIZARD_FAILED";

class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasetinfo: undefined,
      general: undefined,
      fundingAndAffiliation: undefined,
      contributors: undefined,
      experiment: undefined,
      subjectGroups: undefined,
      subjectTemplate: undefined,
      subjects: [],
      subjectExcelFile: undefined,
      tissueSampleCollections: undefined,
      tissueSampleTemplate: undefined,
      tissueSamples: [],
      wizardStep: WIZARD_STEP_GENERAL,
      schema: generalSchema,
      uiSchema: uiSchema,
      result: undefined
    }
  }

  handleGeneralSubmit = data => {
    this.setState({
      general: data,
      wizardStep: WIZARD_STEP_DATASET,
      schema: datasetSchema
    });

    window.scrollTo(0, 0);

  };

  handleDatasetSubmit = data => {
    this.setState({
      datasetinfo: data,
      wizardStep: WIZARD_STEP_FUNDING_AND_AFFILIATION,
      schema: fundingAndAffiliationSchema
    });

    window.scrollTo(0, 0);

  };


  handleFundingAndAffiliationSubmit = data => {
    this.setState({
      fundingAndAffiliation: data,
      wizardStep: WIZARD_STEP_CONTRIBUTORS,
      schema: contributorsSchema
    });

    window.scrollTo(0, 0);

  }

  handleContributorsSubmit = data => {
    this.setState({
      contributors: data,
      wizardStep: WIZARD_STEP_EXPERIMENT,
      schema: experimentSchema
    });

    window.scrollTo(0, 0);

  }

  handleExperimentSubmit = data => {

    const dataset = {...this.state.general, ...this.state.datasetinfo, ...this.state.fundingAndAffiliation, ...this.state.contributors, ...data};
    const res = generateDocumentsFromDataset(dataset);
    
    let subjectExcelData = [];

    if (data.subjectExpMetadata.subjectsExist) {
      subjectExcelData = data.subjectExpMetadata.uploadedExcelFile;
      delete data.subjectExpMetadata.uploadedExcelFile
    } else {
      subjectExcelData = [];
    }

    const datasetObject =  {"general": {...this.state.general}, "datasetinfo": {...this.state.datasetinfo}, "fundingAndAffiliation": {...this.state.fundingAndAffiliation}, "contributors": {...this.state.contributors}, "experiment": {...data}}
    // submit to email
    // Create a json string from data which user has entered.
    var jsonData = JSON.stringify([datasetObject, res]);

    // Create a FormData object in order to send data and files to the backend server
    let formData = new FormData();
    formData.append('jsonData', jsonData) // Json data is in the form of a string
    formData.append('excelData', subjectExcelData) // Excel data is in the form of a dataURL
    
    this.setState(prevState => ({
      dataset: {"general": {...prevState.general}, "datasetinfo": {...prevState.datasetinfo}, "fundingAndAffiliation": {...prevState.fundingAndAffiliation}, "contributors": {...prevState.contributors}, "experiment": {...data}}, 
      experiment: data,
      result: res,
    }));

    // Route the POST request with files+data to api/sendmail
    // axios.post('/api/sendmail', formData)
    axios.post('/api/sendmail', formData)
      .then( response => {console.log(response); this.goToSubmissionCompletedPage() } )
      .catch( error => {console.log(error); this.goToSubmissionFailedPage() } );

  }

  goBackToGeneralWizard = () => {
    this.setState({
      schema: generalSchema,
      wizardStep: WIZARD_STEP_GENERAL
    });

    window.scrollTo(0, 0);

  }

  goBackToDatasetWizard = () => {
    this.setState({
      schema: datasetSchema,
      wizardStep: WIZARD_STEP_DATASET
    });

    window.scrollTo(0, 0);

  }

  goBackTofundingAndAffiliation = () => {
    this.setState({
      schema: fundingAndAffiliationSchema,
      wizardStep: WIZARD_STEP_FUNDING_AND_AFFILIATION
    });

    window.scrollTo(0, 0);

  };

  goBackTocontributors = () => {
    this.setState({
      schema: contributorsSchema,
      wizardStep: WIZARD_STEP_CONTRIBUTORS
    });

    window.scrollTo(0, 0);

  }

  goBackToExperiment = () => {
    this.setState({
      schema: experimentSchema,
      wizardStep: WIZARD_STEP_EXPERIMENT
    });

    window.scrollTo(0, 0);

  }
  
  goToSubmissionCompletedPage = () => {
    this.setState({
      schema: submissionSchema,
      wizardStep: WIZARD_END
    });

    window.scrollTo(0, 0);

  }

  goToSubmissionFailedPage = () => {
    this.setState({
      schema: submissionFailedSchema,
      wizardStep: WIZARD_FAILED
    });

    window.scrollTo(0, 0);

  }
  
  handleGoBackToPreviousStepWizard = () => {
    const dataset = this.state.dataset;
    const studyTopic = getStudyTopic(dataset);
    switch (this.state.wizardStep) {
      case WIZARD_STEP_SUBJECT_GROUP:
      case WIZARD_STEP_SUBJECT_TEMPLATE:
        this.goBackToExperiment();
        break;
      case WIZARD_STEP_DATASET:
        this.goBackToGeneralWizard();
        break;
      case WIZARD_STEP_FUNDING_AND_AFFILIATION:
        this.goBackToDatasetWizard();
        break;
      case WIZARD_STEP_CONTRIBUTORS:
        this.goBackTofundingAndAffiliation();
        break;
      case WIZARD_STEP_EXPERIMENT:
        this.goBackTocontributors();
        break;
      case WIZARD_STEP_TISSUE_SAMPLE_GROUP:
      case WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE:
        if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
          this.goBackToSubjectGroupsWizard();
        } else { // if (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE)
          this.goBackToExperiment();
        }
        break;
      case WIZARD_STEP_SUBJECTS:
        this.goBackToSubjectTemplateWizard();
        break;
      case WIZARD_STEP_TISSUE_SAMPLES:
        this.goBackToTissueSampleTemplateWizard();
        break;
      case WIZARD_END:
        if (studyTopic === STUDY_TOPIC_SUBJECT_VALUE) {
          if (areSubjectsGrouped(dataset)) {
            this.goBackToSubjectGroupsWizard();
          } else {
            this.goBackToSubjectsWizard();
          }
        } else if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE || studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE) {
          if (areTissueSamplesGrouped(dataset)) {
            this.goBackToTissueSampleCollectionsWizard();  
          } else {
            this.goBackToTissueSamplesWizard();  
          }
        } else {
          this.goBackToExperiment();
        }
        break;
      default:
        this.goBackToExperiment();
        break;
    }
  };

  handleReset = () => {
    this.setState({
      dataset: undefined,
      datasetinfo: undefined,
      general: undefined,
      fundingAndAffiliation: undefined,
      contributors: undefined,
      experiment: undefined,
      subjectGroups: null,
      subjectTemplate: null,
      subjects: [],
      tissueSamples: [],
      tissueSampleCollections: [],
      tissueSampleTemplate: null,
      schema: generalSchema,
      uiSchema: uiSchema,
      result: null,
      wizardStep: WIZARD_STEP_GENERAL
    });
  };

  loadState = formStates => {

    this.setState({
      dataset: formStates.dataset,
      datasetinfo: formStates.datasetinfo,
      general: formStates.general,
      fundingAndAffiliation: formStates.fundingAndAffiliation,
      contributors: formStates.contributors,
      experiment: formStates.experiment,
      result: null,          
      uiSchema: uiSchema,     
      schema: generalSchema,
      wizardStep: WIZARD_STEP_GENERAL
    });      

    window.scrollTo(0, 0);
  };

  storeExcelFile = excelFile => {
    console.log('Excel file received on wizard object')
    //console.log(excelFile)
    this.setState( {subjectExcelFile: excelFile} );
  }; //attachSubjectExcelFile


  transformErrors = errors => {
  return errors.map(error => {
    if (error.name === "required") {
      error.message = "Please fill out this field."
    }
    return error;
  });

  };

  render() {
    const schema = this.state.schema;
    switch (this.state.wizardStep) {
      case WIZARD_STEP_GENERAL:
        return (
          <GeneralWizard schema={schema} uiSchema={this.state.uiSchema} formData={this.state.general} onSubmit={this.handleGeneralSubmit} loadState={this.loadState}/>
        );
      case WIZARD_STEP_DATASET:
        return (
          <DatasetWizard schema={schema} uiSchema={this.state.uiSchema} formData={this.state.datasetinfo} transformErrors={this.transformErrors} onSubmit={this.handleDatasetSubmit} onBack={this.handleGoBackToPreviousStepWizard}/>
        );  
      case WIZARD_STEP_FUNDING_AND_AFFILIATION:
        return (
          <FundingAndAffiliationWizard schema={schema} uiSchema={this.state.uiSchema} formData={this.state.fundingAndAffiliation} onSubmit={this.handleFundingAndAffiliationSubmit} onBack={this.handleGoBackToPreviousStepWizard} />
        );
      case WIZARD_STEP_CONTRIBUTORS:
        return (
          <ContributorsWizard schema={schema} uiSchema={this.state.uiSchema} formData={this.state.contributors} onSubmit={this.handleContributorsSubmit} onBack={this.handleGoBackToPreviousStepWizard} />
        );
      case WIZARD_STEP_EXPERIMENT:
        return (
          <ExperimentWizard schema={schema} uiSchema={this.state.uiSchema} formData={this.state.experiment} transformErrors={this.transformErrors} onSubmit={this.handleExperimentSubmit} onBack={this.handleGoBackToPreviousStepWizard} />
        );
      case WIZARD_END:
          return (
            <SubmissionCompletedWizard schema={schema} uiSchema={this.state.uiSchema} formData={this.state.experiment} transformErrors={this.transformErrors} result={this.state.result} dataset={this.state.dataset} onReset={this.handleReset}/>
          );
      case WIZARD_FAILED:
          return (
            <SubmissionFailedWizard schema={schema} uiSchema={this.state.uiSchema} formData={this.state.experiment} transformErrors={this.transformErrors} result={this.state.result} dataset={this.state.dataset} onReset={this.handleReset}/>
          );

      default:
        return (
          <Result result={this.state.result} dataset={this.state.dataset} subjectExcelFile={this.state.subjectExcelFile} onBack={this.handleGoBackToPreviousStepWizard} onReset={this.handleReset} storeExcelFile={this.storeExcelFile} />
        );
    }
  }
};

export default Wizard;