import React, { createRef } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Cookies from 'universal-cookie'
import ReactJson from 'react-json-view';
import { notification } from 'antd';

import GeneralWizard from './Pages/GeneralWizard';
import DatasetWizard from './Pages/DatasetWizard';
import FundingWizard from './Pages/FundingWizard';
import ContributorsWizard from './Pages/ContributorsWizard';
import ExperimentWizard from './Pages/ExperimentWizard.js';
import SubmissionCompletedWizard from './Pages/SubmissionCompletedWizard.js';

import ProgressBar from '../../components/ProgressBar';
import testfunc from '../../helpers/test/test-doc-generator.js';

import { generalSchema, dataset1Schema, dataset2Schema, contributorsSchema, fundingSchema, 
         experimentSchema, submissionSuccededSchema, submissionFailedSchema } 
  from '../../helpers/FormSchemaProvider';

// Todo: 
// [ ] Bug when reseting form. Ticket number will not be updated from query parameter. Attempted fix, but needs testing.

// Path for posting submission to the backend
const SUBMISSION_PATH = "/api/submission/send_email";

const WIZARD_STEP_GENERAL = "WIZARD_STEP_GENERAL";
const WIZARD_STEP_DATASET = "WIZARD_STEP_DATASET";
const WIZARD_STEP_DATASET2 = "WIZARD_STEP_DATASET2";
const WIZARD_STEP_FUNDING = "WIZARD_STEP_FUNDING";
const WIZARD_STEP_CONTRIBUTORS = "WIZARD_STEP_CONTRIBUTORS";
const WIZARD_STEP_EXPERIMENT = "WIZARD_STEP_EXPERIMENT";
const WIZARD_SUCCEEDED = "WIZARD_SUCCEEDED";
const WIZARD_FAILED = "WIZARD_FAILED";

const TEST = "TEST";

const WIZARD_STEPS_LIST = [ WIZARD_STEP_GENERAL, WIZARD_STEP_DATASET, WIZARD_STEP_DATASET2, WIZARD_STEP_FUNDING, WIZARD_STEP_CONTRIBUTORS, WIZARD_STEP_EXPERIMENT ];

const STEP_MAP = new Map(); // Rename to pageMap
STEP_MAP.set(WIZARD_STEP_GENERAL, {schema: generalSchema, wizard: GeneralWizard, name: "general", formRef: createRef()});
STEP_MAP.set(WIZARD_STEP_DATASET, {schema: dataset1Schema, wizard: DatasetWizard, name: "datasetinfo", formRef: createRef()});
STEP_MAP.set(WIZARD_STEP_DATASET2, {schema: dataset2Schema, wizard: DatasetWizard , name: "dataset2info", formRef: createRef()});
STEP_MAP.set(WIZARD_STEP_FUNDING, {schema: fundingSchema, wizard: FundingWizard, name: "funding", formRef: createRef()});
STEP_MAP.set(WIZARD_STEP_CONTRIBUTORS, {schema: contributorsSchema, wizard: ContributorsWizard, name: "contributors", formRef: createRef()});
STEP_MAP.set(WIZARD_STEP_EXPERIMENT, {schema: experimentSchema, wizard: ExperimentWizard, name: "experiment", formRef: createRef()});
STEP_MAP.set(WIZARD_SUCCEEDED, {schema: submissionSuccededSchema, wizard: SubmissionCompletedWizard, name: ""});
STEP_MAP.set(WIZARD_FAILED, {schema: submissionFailedSchema, wizard: SubmissionCompletedWizard, name: ""});

const cookies = new Cookies();

class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.ticketNumber = "";                       // ticket number of the submission
    this.formData = this.initializeFormDataMap(); // formdata for each wizard step in a Map
    this.jsonStr = null;                          // json string of the whole formdata // Todo: What is this used for? Remove??? Duplicate of formData
    this.previewImage = [];                       // image for preview of dataset
    this.openMindsDocument = null;                // openMinds document for the dataset // Currently only used for testing
    this.validSteps = this.initializeValidSteps(); // list of valid steps
    this.state = { 
      currentStep: WIZARD_STEPS_LIST[0],
    }
    this.isInitialized = false;
    this.needUserConfirmation = false; 
  }

  initializeFormDataMap = (formStates) => {
    let formData = new Map();
    
    for (let i = 0; i < WIZARD_STEPS_LIST.length; i++) {
      let iFormName = STEP_MAP.get(WIZARD_STEPS_LIST[i]).name;
      if (formStates === undefined) {
        formData.set(iFormName, {})
      } else {
        formData.set(iFormName, formStates[iFormName])
      }
    }
    return formData;
  };

  initializeValidSteps = () => {
    // Initialize validSteps array with false
    return Array(WIZARD_STEPS_LIST.length).fill(false)
  }

  componentDidMount = () => {
    let jsonStr = cookies.get('wizardData', {doNotParse:true} );
    //let jsonStr2 = localStorage.getItem('wizardData2')
    
    const queryString = window.location.search;
    let ticketNumber = new URLSearchParams(queryString).get('TicketNumber');
    
    // Check if ticketnumber is empty
    if (ticketNumber === null || ticketNumber === undefined) {
      ticketNumber = "";
    }
    this.ticketNumber = ticketNumber;

    if (jsonStr !== undefined) {
      this.loadState( JSON.parse(jsonStr) );
    } 

    // Update the general form with ticketnumber from URL
    var generalForm = this.formData.get('general');
    generalForm.ticketNumber = ticketNumber;
    this.formData.set('general', generalForm);

    // Trigger a re-render to make sure ticket number shows correctly
    let skipFormValidation = true;
    this.goToWizardStep( WIZARD_STEPS_LIST[0], skipFormValidation )

    this.isInitialized = true;
  };

  // METHODS FOR NAVIGATING WIZARD STEPS
  getNextWizardStep = (stepDirection) => {
   
    // find index of current step in WIZARD_STEPS_LIST array
    const currentStepIndex = this.getCurrentStepIndex();

    switch (stepDirection) {
      case "next":
        return WIZARD_STEPS_LIST[currentStepIndex + 1];

      case "prev":
        return WIZARD_STEPS_LIST[currentStepIndex - 1];

      default:
        return WIZARD_STEPS_LIST[currentStepIndex];
    }
  };

  getCurrentStepIndex = () => {
    // find index of current step in WIZARD_STEPS_LIST array
    const isCurrentStep = (step) => step === this.state.currentStep;
    const currentStepIndex = WIZARD_STEPS_LIST.findIndex(isCurrentStep);
    return currentStepIndex;
  }

  goToWizardStep = (nextWizardStep, skipValidation, scrollToTop) => {
    if (skipValidation === undefined) {
      skipValidation = false;
    }
    if (scrollToTop === undefined) {
      scrollToTop = true;
    }

    if (typeof nextWizardStep === "number") {
      nextWizardStep = WIZARD_STEPS_LIST[nextWizardStep];
    }

    // Check if current step is valid
    if (!skipValidation) {
      let tf = STEP_MAP.get(this.state.currentStep).formRef.current.validateForm();
      const currentStepIndex = this.getCurrentStepIndex();
      this.validSteps[currentStepIndex] = tf;
    }

    this.setState({ currentStep: nextWizardStep });

    if (scrollToTop) {
      window.scrollTo(0, 0);
    }
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

      // See: https://stackoverflow.com/questions/3220660/local-storage-vs-cookies
      //localStorage.setItem('wizardData', jsonData)
    }
  }

  handleSubmit = (formData) => {

    let currentWizardStep = this.state.currentStep;
    const lastWizardStep = WIZARD_STEPS_LIST[WIZARD_STEPS_LIST.length - 1];

    this.updateFormData(currentWizardStep, formData)

    if (currentWizardStep === lastWizardStep) {
        this.needUserConfirmation = true;
        this.setState({ currentStep: this.state.currentStep });
    } else {
        this.goNext()
    }
  };

  onSubmitFailed = (errorInfo) => {
    notification.open({
      message: 'Form validation failed',
      description: 'Please review this page for hints on how to correct errors.',
      placement: 'bottomRight',
      onClick: () => { console.log('Notification Clicked!'); },
    });
  }

  handleFinalSubmit = data => {
    if (data === undefined) {
        // todo: use last step...
        let formName = STEP_MAP.get( this.state.currentStep ).name;
        data = this.formData.get( formName )
    }

    // Retrieve excel data from form data if it is present
    let subjectExcelData = [];

    if (data.subjectExpMetadata !== undefined) {
      if (data.subjectExpMetadata.subjectsExist) {
        subjectExcelData = data.subjectExpMetadata.uploadedExcelFile;
        delete data.subjectExpMetadata.uploadedExcelFile
      }
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

    //const res = generateDocumentsFromDataset(datasetFlattened);
    //const res = createOpenMindsDocuments(dataset)
    const res = {'documents': null};

    // // Create a json string from data which user has entered.
    const jsonData = JSON.stringify([dataset, res], null, 2);
    this.jsonStr = jsonData;

    // Create a FormData object in order to send data to the backend server
    let formData = new FormData();
    formData.append('jsonData', jsonData) // Json data is in the form of a string
    formData.append('excelData', subjectExcelData) // Excel data is in the form of a dataURL
    formData.append('previewImage', previewImageFile)

    // Route the POST request with data to api/sendmail
    axios.post(SUBMISSION_PATH, formData)
      .then( response => {console.log(response); this.goToWizardStep(WIZARD_SUCCEEDED) } )
      .catch( error => {console.log(error); this.goToWizardStep(WIZARD_FAILED) } );
  }

  handleReset = () => {
    this.formData = this.initializeFormDataMap();
    this.jsonStr = null;
    this.previewImage = [];
    this.saveFormDatasInCookie();
    let skipValidation = true;
    this.goToWizardStep( WIZARD_STEPS_LIST[0], skipValidation )
    this.validSteps = this.initializeValidSteps();
  };

  loadJson = () => { // Consider moving this to a separate file (e.g. utils.js)
    let input = document.createElement("input");
    input.type = "file";
    input.accept=".json,application/json";
    input.onchange = _ => {

      let selected = input.files;
      if(selected.length === 1){
        const file = selected[0];
        const reader = new FileReader();

        reader.addEventListener("load", () => {
          let data = JSON.parse(reader.result);
          let formStates = data[0];
          this.loadState(formStates);
        }, false);        

        reader.readAsText(file);
      }
    };
    input.click();
  };

  loadState = formStates => {
    this.formData = this.initializeFormDataMap(formStates);
    this.validSteps = this.initializeValidSteps();
    let skipFormValidation = true;
    this.goToWizardStep( WIZARD_STEPS_LIST[0], skipFormValidation )
  };

  saveState = () => {
    const blob = new Blob([this.jsonStr], {type: "data:text/json;charset=utf-8"});
    saveAs(blob, "ebrains_wizard_metadata.json")
  };

  onImageUploaded = (imageFileList) => {
    this.previewImage = imageFileList;
  };

  onTest = () => {
    let formDataObject = Object.fromEntries(this.formData)
    this.openMindsDocument = testfunc(formDataObject);
    this.goToWizardStep(TEST);
  }

  render() {
    if (process.env.NODE_ENV === "development") {
      switch (this.state.currentStep) {
        case TEST:
          return (
            <div className="col-md-12">
            <ReactJson collapsed={10} name={false} src={this.openMindsDocument} />
            </div>
          );
        default:
          break;
      }
    }

    const schema = STEP_MAP.get(this.state.currentStep).schema;
    const WizardComponent = STEP_MAP.get(this.state.currentStep).wizard;
    const formName = STEP_MAP.get(this.state.currentStep).name;

    const currentFormData = this.formData.get(formName);
    const stepNum = WIZARD_STEPS_LIST.indexOf(this.state.currentStep);

    const numSteps = WIZARD_STEPS_LIST.length;
    const lastStep = WIZARD_STEPS_LIST[numSteps - 1];

    let wizardPageProps = {
      schema: schema,
      formData: currentFormData,
      onSubmit: this.handleSubmit,
      onChange: this.onFormChanged,
      onError: this.onSubmitFailed,
      formRef: STEP_MAP.get(this.state.currentStep).formRef
    }

    switch (this.state.currentStep) {
      case WIZARD_STEP_GENERAL:
        wizardPageProps.onReset = this.handleReset;
        wizardPageProps.loadState = this.loadJson;
        break;

      case WIZARD_STEP_DATASET2:
        wizardPageProps.imageFileList = this.previewImage;
        wizardPageProps.imageUploadedFcn = this.onImageUploaded;
        wizardPageProps.goBack = this.goBack;
        break;
      case WIZARD_STEP_EXPERIMENT:
        // check that items 0-4 are valid  // Todo: check that all items are valid except the last one
        wizardPageProps.isValid = this.validSteps.slice(0, 5).every( (item) => item === true );
       
        wizardPageProps.doShowModal = this.needUserConfirmation;
        wizardPageProps.onSubmissionConfirmed = this.handleFinalSubmit;
        wizardPageProps.onSubmissionCanceled = () => { this.goToWizardStep(this.state.currentStep, true, false) }; 

        this.needUserConfirmation = false; // reset the flag for the submission confirmation dialog

      case WIZARD_STEP_DATASET: case WIZARD_STEP_FUNDING: case WIZARD_STEP_CONTRIBUTORS: case WIZARD_STEP_EXPERIMENT:
        wizardPageProps.goBack = this.goBack;
        break;

      default:
        break;
    };

    if (this.state.currentStep === lastStep) {
      // Check that all previous steps are valid
      wizardPageProps.isValid = this.validSteps.slice(0, numSteps-1).every( (item) => item === true );
      
      wizardPageProps.doShowModal = this.needUserConfirmation;
      wizardPageProps.onSubmissionConfirmed = this.handleFinalSubmit;
      wizardPageProps.onSubmissionCanceled = () => { this.goToWizardStep(this.state.currentStep, true, false) }; 
      
      this.needUserConfirmation = false; // reset the flag for the submission confirmation dialog
    }
    
    switch (this.state.currentStep) {

      case WIZARD_STEP_GENERAL: case WIZARD_STEP_DATASET: case WIZARD_STEP_DATASET2: case WIZARD_STEP_FUNDING: case WIZARD_STEP_CONTRIBUTORS: case WIZARD_STEP_EXPERIMENT:

        return (
            <>
            { (process.env.NODE_ENV === "development") ? <button type="button" className="btn btn-default" onClick={this.onTest}>Test</button> : null }
              <ProgressBar step={stepNum} status={this.validSteps} onChanged={this.goToWizardStep} />
              <WizardComponent {...wizardPageProps} />
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