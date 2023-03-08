const express       = require('express');               // Express is a framework for creating web apps

// Get dependencies that are needed for the submission route
const fileUpload    = require('express-fileupload');    // Middleware for uploading file content / parsing multiform data in requests
const atob          = require('atob');                  // atob is needed for decoding base64 encoded strings

// Get local modules that are needed for the submission route
var mailTransporter = require('../mail-setup/MailTransporter');

const confirmationEmailTemplate = require('../../templates/ConfirmationEmail');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Create a router to handle requests
const router = express.Router();            

const uploadOptions = { limits: { fileSize: 50 * 1024 * 1024 } } // restrict size of uploaded files to 50 MB
router.use( fileUpload(uploadOptions) );


// Create a POST route for receiving files that should be sent to curation team via email.
router.post('/send_email', (req, res) => { 
  console.log('Received form submission post request from client')

  let jsonObject = JSON.parse(req.body.jsonData);
  let jsonFormData = jsonObject.formData;
  
  const emailAddressCurationTeam = process.env.EMAIL_ADDRESS_CURATION_SUPPORT;
  const emailAddressUser = getContactPersonEmailAddress(jsonFormData);

  // Create a string array with email addresses for the curation team and the user submitting metadata.
  const emailRecipients = [emailAddressCurationTeam, emailAddressUser];
  
  // Need two email messages, one for user and one for curation team
  let message = [createMetadataEmailMessage(jsonFormData, req)];
  message.push( rewriteMailBodyForUser(message[0], jsonFormData) )

  // Send the message to each of the emailRecipients. NOTE: The sendResponseToClient function is called after each email has been sent, 
  // but the response will only be sent to the client for the first email. This is fine, because it is only important for the client to know
  // that the email has been sent to the curation team, but it is not important for the client to know if the email has been sent to the user.
  // This could be handled better in the future.
  for (let i = 0; i < emailRecipients.length; i++) {
    sendMetadataEmailMessage(emailRecipients[i], message[i], sendResponseToClient)
  }

  // Function that sends the response to the frontend client
  function sendResponseToClient(mailResponse) {
    console.log('Sending response to client')
    if (mailResponse.ok) {
      res.send({status: true, message: 'Email is sent'})
    } else {
      res.status(500).send(mailResponse.error.message)
    }
  }
});


// Functions for creating and sending email messages

function createMetadataEmailMessage(jsonObject, requestObject) {
  // Create an email message object but leave the recipient empty for now.

  var message = {
    from: process.env.EMAIL_ADDRESS_SENDER,
    to: '',
    subject: writeMailSubject(jsonObject),
    text: writeMailBody(jsonObject),
    attachments: prepareMailAttachments(requestObject)
  };

  return message
}

function rewriteMailBodyForUser(emailMessage, jsonObject) {
  let rewrittenMessage = {};
  Object.assign(rewrittenMessage, emailMessage);

  rewrittenMessage.text = writeMailBodyConfirmation(jsonObject)

  return rewrittenMessage
}

function sendMetadataEmailMessage(emailRecipient, emailMessage, sendResponseToClientFunction) {
  // Send the email message to the emailRecipient
  
  let mailResponse = {ok: false, error: null};

  try {
    // Change the recipient of the email message
    emailMessage.to = emailRecipient;

    mailTransporter.sendMail(emailMessage, function(error, info){
      if (error) {
        console.log(`Failed to send mail with following error:\n`, error)
        mailResponse.error = error;
      } else {
        console.log(`Email sent: ${emailMessage.to}` + info.response)
        mailResponse.ok = true;
      }
      sendResponseToClientFunction(mailResponse)
    });

  } catch (err) {
      console.log('Failed to send the message via email with the following error:\n', err)  
      mailResponse.error = err;
      sendResponseToClientFunction(mailResponse)
  }
}
  
// Define utility functions
// - - - - - - - - - - - - - - - - - - - - - - - - 

function getContactPersonEmailAddress(jsonObject) {

  let emailAddress = undefined;
  emailAddress = jsonObject["general"]["contactperson"]["email"];
  return emailAddress;
}

function writeMailSubject(jsonObject) {
  const dsTitle = jsonObject["datasetinfo"]["dataset"]["fullName"];
  let mailSubjectStr = `[Wizard Metadata Submission] ${dsTitle}`;

  let ticketNumber = jsonObject["general"]["ticketNumber"];
  if (ticketNumber) {
    ticketNumber = cleanTicketNumber(ticketNumber);
    mailSubjectStr = mailSubjectStr + ` [Ticket#${ticketNumber}]`;
  }

  return mailSubjectStr
}

function writeMailBody(jsonObject) {
  // Add some key information to a mail body string
  
    // TODO: use contact person if available

  const dsTitle = jsonObject["datasetinfo"]["dataset"]["fullName"];
  const contactFirstName = jsonObject["general"]["contactperson"]["firstName"];
  const contactLastName = jsonObject["general"]["contactperson"]["lastName"];
  const contactEmail = jsonObject["general"]["contactperson"]["email"];
  
  let mailBodyStr = `Dataset information:

Dataset Custodian: ${contactFirstName + ' ' + contactLastName}
Dataset Custodian Email: ${contactEmail}
Dataset Title: ${dsTitle}
    
Attachments:
  
`;
  return mailBodyStr
}
  
function writeMailBodyConfirmation(jsonObject) {

  const contactPersonName = jsonObject["general"]["contactperson"]["firstName"];
  const datasetTitle = jsonObject["datasetinfo"]["dataset"]["fullName"];

  var ticketPrompt = "";
  let ticketNumber = jsonObject["general"]["ticketNumber"];
  if (ticketNumber) {
    ticketNumber = cleanTicketNumber(ticketNumber);
    ticketPrompt = ", and please add the following ticket reference to the mail subject line: " + `[Ticket#${ticketNumber}]`;
  }
//   let mailBodyStr = `Dear ${contactPersonName},

// Thank you for submitting metadata for the dataset "${datasetTitle}". We will review the metadata and get back to you as soon as possible.

// The attached file(s) are the metadata you submitted. The json file contains the metadata in a machine-readable format and if you at some point need to make changes to the metadata, you can upload it to the wizard, make modifications and resubmit.

// If you have any further questions, do not hesitate to contact the curation team at ${process.env.EMAIL_ADDRESS_CURATION_SUPPORT}${ticketPrompt}.

// Best regards,
// EBRAINS Curation Service
// curation-support@ebrains.eu

// `;
let mailBodyStr = eval(`\`${confirmationEmailTemplate}\``);
return mailBodyStr
}

function prepareMailAttachments(requestObject) {

  let mailAttachmentArray = []; // Initialize an empty list for attachments

  let jsonAttachment = { // utf-8 string as an attachment
    filename: 'ebrains_wizard_metadata.json',
    content: requestObject.body.jsonData
  };
  mailAttachmentArray.push(jsonAttachment)
  
  if (requestObject.body.excelData) { // push excel data to the attachment list if it is present
    let excelAttachment = {
      filename:'ebrains_wizard_subject_data.xlsx',
      content: convertExcelDataUrlToByteArray(requestObject.body.excelData), 
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    };
    
    mailAttachmentArray.push(excelAttachment)

  } else {  
    // No excel file was provided, thats fine.
  }

  if (requestObject.files !== null) {
    if (requestObject.files.previewImage) { // push image file to the attachment list if it is present
      //console.log('preview image', requestObject.body.previewImage)
      //console.log('type of preview image', typeof requestObject.body.previewImage)
      //console.log('image size', requestObject.files.previewImage.size / 1024 / 1024, 'MB')
      
      let previewImageAttachment = {
        filename: requestObject.files.previewImage.name,
        content: requestObject.files.previewImage.data,
        contentType: requestObject.files.previewImage.mimetype
      };
      mailAttachmentArray.push(previewImageAttachment)
    }
  } else {  
    // No preview image file was provided, thats fine.
  }

  return mailAttachmentArray
}

function convertExcelDataUrlToByteArray(excelString) {

  var byteString = atob(excelString.split(',')[1])

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var dw = new DataView(ab);
  for(var i = 0; i < byteString.length; i++) {
    dw.setUint8(i, byteString.charCodeAt(i));
  }

  //convert bytestring from string to uint8array
  var uint8Array = new Uint8Array(ab);
  return uint8Array
}
  
function cleanTicketNumber(ticketNumber) {
  // Remove square brackets from ticket number
  let cleanedTicketNumber = ticketNumber.replace('[', '');
  cleanedTicketNumber = cleanedTicketNumber.replace(']', '');

  // Remove ticket from ticket number
  cleanedTicketNumber = cleanedTicketNumber.replace('Ticket', '');

  // Remove whitespace from ticket number
  cleanedTicketNumber = cleanedTicketNumber.replace(' ', '');
  
  // Remove number symbol from ticket number
  cleanedTicketNumber = cleanedTicketNumber.replace('#', '');

  return cleanedTicketNumber
}


// Export the router so it can be used in the main app
module.exports = router;   
