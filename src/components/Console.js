import React from 'react';
import Form from '@rjsf/core';
import RichTextWidget from './customWidgets';

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
        
        let wizardLink = this.getWizardLink(formData.ticketNumber);
        
        console.log('wizlink', wizardLink)

        if (wizardLink !== '') {
            formData.wizardLink = wizardLink;
            this.formData = formData;
            this.setState({ update: true } );
            console.log(formData)
        }
    }

    getWizardLink = (ticketNumber) => {
        let wizardLink = '';

        if (ticketNumber === undefined || ticketNumber === '') {
            wizardLink = "https://metadata-wizard.apps.hbp.eu";
        } else if (ticketNumber !== undefined) {
            wizardLink = "https://metadata-wizard.apps.hbp.eu/?TicketNumber=" + ticketNumber;
            };
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

    render() {   
        const handleOnChange = ( {formData} ) => this.onFormChanged(formData);

        let formData = this.formData;
        console.log('on render', formData.wizardLink)
 
        return ( 
            <Form widgets={{richtext: RichTextWidget}} schema={consoleSchema} uiSchema={uiSchema} formData={this.formData} onChange={handleOnChange} >
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