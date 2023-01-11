import React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Cookies from 'universal-cookie'
import ProgressBar from './ProgressBar';

import GeneralWizard from './Wizard/GeneralWizard';
import DatasetWizard from './Wizard/DatasetWizard';
import FundingAndAffiliationWizard from './Wizard/FundingAndAffiliationWizard';
import ContributorsWizard from './Wizard/ContributorsWizard';
import ExperimentWizard from './Wizard/ExperimentWizard.js';
import SubmissionCompletedWizard from './Wizard/SubmissionCompletedWizard.js';

import { generateDocumentsFromDataset }  from '../helpers/Translator';
import { generalSchema, datasetSchema, experimentSchema } from '../helpers/Wizard';

import * as fundingAndAffiliationModule from '../schemas/fundingAndAffiliation.json';
import * as contributorsModule from '../schemas/contributors.json';
import * as submissionSuccededModule from '../schemas/submissionSucceededSchema.json';
import * as submissionFailedModule from '../schemas/submissionFailedSchema.json';

const fundingAndAffiliationSchema = fundingAndAffiliationModule.default;
const contributorsSchema = contributorsModule.default;
const submissionSuccededSchema = submissionSuccededModule.default;
const submissionFailedSchema = submissionFailedModule.default;

const WIZARD_STEP_GENERAL = "WIZARD_STEP_GENERAL";
const WIZARD_STEP_DATASET = "WIZARD_STEP_DATASET";
const WIZARD_STEP_FUNDING = "WIZARD_STEP_FUNDING";
const WIZARD_STEP_CONTRIBUTORS = "WIZARD_STEP_CONTRIBUTORS";
const WIZARD_STEP_EXPERIMENT = "WIZARD_STEP_EXPERIMENT";
const WIZARD_SUCCEEDED = "WIZARD_SUCCEEDED";
const WIZARD_FAILED = "WIZARD_FAILED";

const WIZARD_STEPS_LIST = [ WIZARD_STEP_GENERAL, WIZARD_STEP_DATASET, WIZARD_STEP_FUNDING, WIZARD_STEP_CONTRIBUTORS, WIZARD_STEP_EXPERIMENT ];

const STEP_MAP = new Map();
STEP_MAP.set(WIZARD_STEP_GENERAL, {schema: generalSchema, wizard: GeneralWizard, name: "general"});
STEP_MAP.set(WIZARD_STEP_DATASET, {schema: datasetSchema, wizard: DatasetWizard, name: "datasetinfo"});
STEP_MAP.set(WIZARD_STEP_FUNDING, {schema: fundingAndAffiliationSchema, wizard: FundingAndAffiliationWizard, name: "fundingAndAffiliation"});
STEP_MAP.set(WIZARD_STEP_CONTRIBUTORS, {schema: contributorsSchema, wizard: ContributorsWizard, name: "contributors"});
STEP_MAP.set(WIZARD_STEP_EXPERIMENT, {schema: experimentSchema, wizard: ExperimentWizard, name: "experiment"});
STEP_MAP.set(WIZARD_SUCCEEDED, {schema: submissionSuccededSchema, wizard: SubmissionCompletedWizard, name: ""});
STEP_MAP.set(WIZARD_FAILED, {schema: submissionFailedSchema, wizard: SubmissionCompletedWizard, name: ""});

const cookies = new Cookies();

class Wizard extends React.Component {
  constructor(props) {
    super(props);

    this.formData = this.initializeFormDataMap(); // formdata for each wizard step in a Map
    this.jsonStr = null;                          // json string of the whole formdata
    this.previewImage = [];                       // image for preview of dataset
    this.state = { 
      currentStep: WIZARD_STEPS_LIST[0],
    }

    this.isInitialized = false;
  }

  initializeFormDataMap = (formStates) => {
    let formData = new Map();
    
    for (let i = 0; i < WIZARD_STEPS_LIST.length; i++) {
      let iFormName = STEP_MAP.get(WIZARD_STEPS_LIST[i]).name;
      if (formStates === undefined) {
        formData.set(iFormName, undefined)
      } else {
        formData.set(iFormName, formStates[iFormName])
      }
    }
    return formData;
  };

  componentDidMount = () => {
    let jsonStr = cookies.get('wizardData', {doNotParse:true} );
    
    if (jsonStr !== undefined) {
      let formStates = JSON.parse(jsonStr);  
      this.loadState(formStates);
    }
    this.isInitialized = true;
  };

  // METHODS FOR NAVIGATING WIZARD STEPS
  getNextWizardStep = (stepDirection) => {
   
    // find index of current step in WIZARD_STEPS_LIST array
    const isCurrentStep = (step) => step === this.state.currentStep;
    const currentStepIndex = WIZARD_STEPS_LIST.findIndex(isCurrentStep);

    switch (stepDirection) {
      case "next":
        return WIZARD_STEPS_LIST[currentStepIndex + 1];

      case "prev":
        return WIZARD_STEPS_LIST[currentStepIndex - 1];

      default:
        return WIZARD_STEPS_LIST[currentStepIndex];
    }
  };

  goToWizardStep = (nextWizardStep) => {
    this.setState({ currentStep: nextWizardStep });
    window.scrollTo(0, 0);
  };

  goBack = () => {
    let nextWizardStep = this.getNextWizardStep("prev");
    this.goToWizardStep(nextWizardStep);
  }

  goNext = () => {
    let nextWizardStep = this.getNextWizardStep("next");
    this.goToWizardStep(nextWizardStep);
  }


  // METHODS FOR HANDLING FORM DATA
  onFormChanged = (formData) => {
    // Update formData for current wizard step
    this.updateFormData(this.state.currentStep, formData)
  }

  updateFormData = (wizardStep, formData) => {
    let formName = STEP_MAP.get(wizardStep).name;
    this.formData.set(formName, formData)

    this.saveFormDatasInCookie();
  }

  saveFormDatasInCookie = () => {
    if (this.isInitialized) {
      let dataset = Object.fromEntries(this.formData) // convert formData Map to object
      const jsonData = JSON.stringify(dataset);
      cookies.set('wizardData', jsonData, { path: '/' })
    }
  }

  handleSubmit = (formData) => {

    let currentWizardStep = this.state.currentStep;

    switch (currentWizardStep) {

      case WIZARD_STEP_EXPERIMENT:
        this.handleFinalSubmit(formData);
        return // Setting next wizard page is handled internally in handleFinalSubmit
        
      default:
        this.updateFormData(currentWizardStep, formData)
        this.goNext()
    }
  };

  handleFinalSubmit = data => {

    // retrieve excel data from data
    let subjectExcelData = [];

    if (data.subjectExpMetadata.subjectsExist) {
      subjectExcelData = data.subjectExpMetadata.uploadedExcelFile;
      delete data.subjectExpMetadata.uploadedExcelFile
    } else {
      subjectExcelData = [];
    }

    let previewImageFile = [];
    if (this.previewImage !== undefined && this.previewImage.length > 0) {
      previewImageFile = this.previewImage[0].originFileObj;
    }

    // Add data to the formData map (after excel data has been removed)
    this.updateFormData(this.state.currentStep, data)

    let dataset = Object.fromEntries(this.formData) // convert formData Map to object
    let datasetFlattened = Object.keys(dataset).reduce(function (value, key) {
      return {...value, ...dataset[key]}; // flatten object
    }, []);

    const res = generateDocumentsFromDataset(datasetFlattened);

    // Create a json string from data which user has entered.
    const jsonData = JSON.stringify([dataset, res]);
    this.jsonStr = jsonData;

    // Create a FormData object in order to send data to the backend server
    let formData = new FormData();
    formData.append('jsonData', jsonData) // Json data is in the form of a string
    formData.append('excelData', subjectExcelData) // Excel data is in the form of a dataURL
    formData.append('previewImage', previewImageFile)

    // Route the POST request with data to api/sendmail
    axios.post('/api/sendmail', formData)
      .then( response => {console.log(response); this.goToWizardStep(WIZARD_SUCCEEDED) } )
      .catch( error => {console.log(error); this.goToWizardStep(WIZARD_FAILED) } );
  }

  handleReset = () => {
    this.formData = this.initializeFormDataMap();
    this.jsonStr = null;
    this.previewImage = [];
    this.saveFormDatasInCookie();
    this.goToWizardStep( WIZARD_STEPS_LIST[0] )
  };

  loadState = formStates => {
    this.formData = this.initializeFormDataMap(formStates);
    this.goToWizardStep( WIZARD_STEPS_LIST[0] )
  };

  saveState = () => {
    const blob = new Blob([this.jsonStr], {type: "data:text/json;charset=utf-8"});
    saveAs(blob, "ebrains_wizard_metadata.json")
  };

  onImageUploaded = (imageFileList) => {
    this.previewImage = imageFileList;
  };

  render() {    
    const schema = STEP_MAP.get(this.state.currentStep).schema;
    const WizardComponent = STEP_MAP.get(this.state.currentStep).wizard;
    const formName = STEP_MAP.get(this.state.currentStep).name;

    const currentFormData = this.formData.get(formName);
    const stepNum = WIZARD_STEPS_LIST.indexOf(this.state.currentStep);

    let wizardPageProps = {
      schema: schema,
      formData: currentFormData,
      onSubmit: this.handleSubmit,
      onChange: this.onFormChanged
    }

    switch (this.state.currentStep) {
      case WIZARD_STEP_GENERAL:
        wizardPageProps.loadState = this.loadState;
        wizardPageProps.onReset = this.handleReset;
        break;

      case WIZARD_STEP_DATASET:
        wizardPageProps.imageFileList = this.previewImage;
        wizardPageProps.imageUploadedFcn = this.onImageUploaded;
        wizardPageProps.goBack = this.goBack;
        break;

      case WIZARD_STEP_FUNDING: case WIZARD_STEP_CONTRIBUTORS: case WIZARD_STEP_EXPERIMENT:
        wizardPageProps.goBack = this.goBack;
        break;

      default:
        break;
    };


    switch (this.state.currentStep) {

      case WIZARD_STEP_GENERAL: case WIZARD_STEP_DATASET: case WIZARD_STEP_FUNDING: case WIZARD_STEP_CONTRIBUTORS: case WIZARD_STEP_EXPERIMENT:
        return (
          <>
            <ProgressBar step={stepNum} />
            <WizardComponent {...wizardPageProps} /> 
            {/* <WizardComponent schema={schema} formData={currentFormData} onSubmit={this.handleSubmit} onChange={this.onFormChanged} goBack={this.goBack} />  */}
          </>
        );
      
      case WIZARD_SUCCEEDED: case WIZARD_FAILED:
        return ( <WizardComponent schema={schema} onReset={this.handleReset} onSave={this.saveState}/> );

      default:
        return ( <h1>Error</h1> );
    }
  }
};

export default Wizard;