// This script configures the backend server that is used for sending the 
// user-submitted metadata to the ebrains curation team

//  This script requires the following environment variables to be set:
//  - EMAIL_ADRESS_SENDER
//  - EMAIL_ADDRESS_CURATION_SUPPORT

// Get installed node modules that are needed for the server
const express = require('express');        // Express is a framework for creating web apps
const path = require('path');              // Path is used for creating file paths
const fileUpload = require('express-fileupload'); // Middleware for uploading file content
// const bodyparser = require('body-parser'); // Body-parser is needed for parsing incoming request bodies

// Get local modules that are needed for the server
var mailTransporter = require('./mail_setup/MailTransporter');
const { endianness } = require('os');

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

  // Send the message to each of the emailRecipients
  for (let i = 0; i < emailRecipients.length; i++) {
    sendMetadataEmailMessage(emailRecipients[i], message);
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
  try {
    // Change the recipient of the email message
    emailMessage.to = emailRecipient;
  
    mailTransporter.sendMail(emailMessage, function(error, info){
      if (error) {
        console.log(error)
        res.status(500).send(err)
      } else {
        console.log('Email sent: ' + info.response)
        res.send({status: true, message: 'Email is sent'})
      }
    });

  } catch (err) {
      console.log('Failed to send email')
      res.status(500).send(err);
  }
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
  
  if (requestObject.files) { // push excel file to the attachment list if it is present
    let excelAttachment = {
      filename:'subject_data.xlsx',
      content: requestObject.files.excelFile.data, // there should be a file named excelFile
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    };
    
    mailAttachmentArray.push(excelAttachment)

  } else {  
    // No excel file was provided, thats fine.
  }

  return mailAttachmentArray
}
