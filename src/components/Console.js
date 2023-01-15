import React from 'react';
import Form from '@rjsf/core';
import RichTextWidget from './customWidgets';
import axios from 'axios';

import * as consoleModule from '../schemas/console/consoleSchema.json';
import * as consoleComponentModule from '../schemas/console/consoleComponentSchema.json';

const consoleSchema = consoleModule.default;
const uiSchema = consoleComponentModule.default;

class Console extends React.Component {
    constructor(props) {
        super(props);
        this.isInitialized = false;
        this.formData = this.initializeFormDataMap();

        this.state = { 
            update: false,
          }
    }
    
    initializeFormDataMap = (formStates) => {
        let formData = formStates;
        if (formData === undefined) {
            formData = {wizardLink:"", contactinfo:{"firstName":""}};
        }
        return formData;
      };

    // METHODS FOR HANDLING FORM DATA
    onFormChanged = (formData) => {
        // Update formData for current wizard step        
        
        let wizardLink = this.getWizardLink(formData);

        if (wizardLink !== '') {
            formData.wizardLink = wizardLink;
            this.formData = formData;
            this.setState({ update: true } );
        }
    }

    getWizardLink = (formData) => {
        let wizardLink = '';
        let queryParams = {};

        if (formData.ticketNumber !== undefined && formData.ticketNumber !== '') {
            queryParams.TicketNumber = formData.ticketNumber;
        };

        if (formData.datasetId !== undefined && formData.datasetId !== '') {
            queryParams.DatasetID = formData.datasetId;
        };

        // Create the query string
        let queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
        if (queryString !== '') {
            queryString = '?' + queryString;
        }
        wizardLink = "https://metadata-wizard.apps.hbp.eu/" + queryString;

        return wizardLink;
    }


    onGenerate = () => {
        let formData = this.formData;

        let wizardLink = formData.wizardLink;
        let firstName = formData.contactinfo.firstName;

        let mailBodyStr = `Dear ${firstName},

You can now start the process of submitting your metadata in the EBRAINS Metadata Wizard. 
Please follow the link below to start the submission process.
${wizardLink}

Best regards,
EBRAINS Curation Service
curation-support@ebrains.eu
 `;

        this.formData.emailMessage = mailBodyStr;
        console.log(mailBodyStr)
        this.setState({ update: true } );
    }

    handleFinalSubmit = () => {
        // Route the POST request with data to api/sendmail

        let jsonData = {
            'emailRecipient': this.formData.contactinfo.email, 
            'emailMessage': this.formData.emailMessage
        }

        let jsonString = JSON.stringify(jsonData); // Convert the form data to a json string

        // Create a FormData object in order to send data to the backend server
        let formData = new FormData();
        formData.append('jsonData', jsonString) // Json data is in the form of a string
        axios.post('/api/console/sendwizardlink', formData)

        // .then( response => {console.log(response); this.goToWizardStep(WIZARD_SUCCEEDED) } )
        // .catch( error => {console.log(error); this.goToWizardStep(WIZARD_FAILED) } );
    }

    render() {   
        const handleOnChange = ( {formData} ) => this.onFormChanged(formData);

        let formData = this.formData;
        console.log('on render', formData.wizardLink)
 
        return ( 
            <Form widgets={{richtext: RichTextWidget}} schema={consoleSchema} uiSchema={uiSchema} formData={this.formData} onChange={handleOnChange} onSubmit={this.handleFinalSubmit}>
                <span className="wizardLink">{formData.wizardLink}</span>
                
                <div className="footer">
                    <div className="col-xs-8 back-panel">
                        <button type="button" className="btn btn-default" onClick={this.onGenerate}>Generate Email</button>
                    </div>
                    <div className="col-xs-4 submit-panel">
                        <button type="submit" className="btn btn-info btn-primary" name="submit">Send Email</button>
                    </div>
                </div>
            </Form>
        );
    }
};

export default Console;