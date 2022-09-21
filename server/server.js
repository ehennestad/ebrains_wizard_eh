// This script configures the backend server that is used for sending the 
// user-submitted metadata to the ebrains curation team

//  This script requires the following environment variables to be set:
//  - EMAIL_ADRESS_SENDER
//  - EMAIL_ADDRESS_CURATION_SUPPORT

// Get installed node modules that are needed for the server
const express = require('express');        // Express is a framework for creating web apps
const path = require('path');              // Path is used for creating file paths
const fileUpload = require('express-fileupload'); // Middleware for uploading file content
const atob = require('atob');              // atob is needed for decoding base64 encoded strings

// const bodyparser = require('body-parser'); // Body-parser is needed for parsing incoming request bodies

// Get local modules that are needed for the server
var mailTransporter = require('./mail_setup/MailTransporter');

// This app is deployed on OpenShift, and containers in OpenShift should bind to
// any address (which is designated with 0.0.0.0) and use port 8080 by default
const ip = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 8080;


// Create and configure the express app
// - - - - - - - - - - - - - - - - - - - - - - - - 

const app = express()

const uploadOptions = { limits: { fileSize: 10 * 1024 * 1024 } } // restrict size of uploaded files to 10 MB
app.use( fileUpload(uploadOptions) );

// Configure the renderer.
app.set('view engine', 'ejs'); //Necessary??
app.set('views', path.join(__dirname, '..', '/build'));  //Necessary??
app.use(express.static(path.join(__dirname, '..', '/build')));

//app.use(bodyparser.json({ limit: '50mb' }));
//app.use(bodyparser.urlencoded({ limit: '50mb', extended: false }));

// console.log that the server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));


// Define routes for the express app
// - - - - - - - - - - - - - - - - - - - - - - - - 

// Serve the react app on the default (/) route
app.get('/', function(req, res) {
  res.render('index.html')
});

// Create a GET route for testing if express server is online
app.get('/api/express_test_connection', (req, res) => {
  console.log("Express server is connected.")
  res.send({ message: 'Express server says hello' });
});

// Create a POST route for receiving files that should be sent to curation team via email.
app.post('/api/sendmail', (req, res) => { 
  console.log('Received post request')

  let jsonObject = JSON.parse(req.body.jsonData);

  const emailCurationTeam = process.env.EMAIL_ADDRESS_CURATION_SUPPORT;
  const emailMetadataSubmitter = jsonObject[0]["general"]["custodian"]["email"];

  // Create a string array with email addresses for the curation team and the user submitting metadata.
  const emailRecipients = [emailCurationTeam, emailMetadataSubmitter];

  let message = createMetadataEmailMessage(jsonObject, req);
  let mailResponse = [];

  // Send the message to each of the emailRecipients
  for (let i = 0; i < emailRecipients.length; i++) {
    mailResponse[i] = sendMetadataEmailMessage(emailRecipients[i], message);
  }

  // Send the response to the client (only the first response is sent)
  // This is because the client only needs to know if the email was sent to the curation team.
  if (mailResponse[0].ok) {
    res.send({status: true, message: 'Email is sent'})
  } else {
    res.status(500).send(mailResponse[0].error)
  }

});

// Functions for creating and sending email messages

function createMetadataEmailMessage(jsonObject, requestObject) {
  // Create an email message object but leave the recipient empty for now.

  var message = {
    from: process.env.EMAIL_ADRESS_SENDER,
    to: '',
    subject: writeMailSubject(jsonObject),
    text: writeMailBody(jsonObject),
    attachments: prepareMailAttachments(requestObject)
  };

  return message
}

function sendMetadataEmailMessage(emailRecipient, emailMessage) {
  // Send the email message to the emailRecipient
  
  let mailResponse = {ok: false, error: null};

  try {
    // Change the recipient of the email message
    let concreteMessage = {};
    Object.assign(concreteMessage, emailMessage);
    concreteMessage.to = emailRecipient;
    
    mailTransporter.sendMail(concreteMessage, function(error, info){
      if (error) {
        console.log(error)
        mailResponse.error = error;
      } else {
        console.log(`Email sent: ${concreteMessage.to}` + info.response)
        mailResponse.ok = true;
      }
    });

  } catch (err) {
      console.log('Failed to send email')
      console.log(err)
      mailResponse.error = err;
  }
  return mailResponse
}



// Define utility functions
// - - - - - - - - - - - - - - - - - - - - - - - - 

function writeMailSubject(jsonObject) {
  const dsTitle = jsonObject[0]["general"]["datasetinfo"]["datasetTitle"];
  let mailSubjectStr = `[Wizard Metadata Submission] ${dsTitle}`;

  return mailSubjectStr
}

function writeMailBody(jsonObject) {
  // Add some key information to a mail body string
  
    // Todo use contact person if available

  const dsTitle = jsonObject[0]["general"]["datasetinfo"]["datasetTitle"];
  const contactFirstName = jsonObject[0]["general"]["custodian"]["firstName"];
  const contactLastName = jsonObject[0]["general"]["custodian"]["lastName"];
  const contactEmail = jsonObject[0]["general"]["custodian"]["email"];
  
  let mailBodyStr = `Dataset information:

Contact Person: ${contactFirstName + ' ' + contactLastName}
Contact Person Email: ${contactEmail}
Dataset Title: ${dsTitle}
    
Attachments:
  
`;
  return mailBodyStr
  }

function prepareMailAttachments(requestObject) {

  let mailAttachmentArray = []; // Initialize an empty list for attachments

  let jsonAttachment = { // utf-8 string as an attachment
    filename: 'metadata.json',
    content: requestObject.body.jsonData
  };
  mailAttachmentArray.push(jsonAttachment)
  
  if (requestObject.body.excelData) { // push excel data to the attachment list if it is present
    let excelAttachment = {
      filename:'subject_data.xlsx',
      content: convertExcelDataUrlToByteArray(requestObject.body.excelData), 
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    };
    
    mailAttachmentArray.push(excelAttachment)

  } else {  
    // No excel file was provided, thats fine.
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