const express       = require('express');               // Express is a framework for creating web apps
const fileUpload    = require('express-fileupload');    // Middleware for uploading file content / parsing multiform data in requests

// Get local modules that are needed for the server
var mailTransporter = require('../mail_setup/MailTransporter');

// Create a router to handle requests
const router = express.Router();
router.use(fileUpload)

// Export the router so it can be used in the main app
module.exports = router;

// Tentative route for sending a wizard link to the user from a curator dashboard / console
router.post('/sendwizardlink', (req, res) => {
  console.log('Received wizard link post request from client')

  let jsonObject = JSON.parse(req.body.jsonData);

  let emailMessage = {
    from: process.env.EMAIL_ADDRESS_SENDER,
    to: jsonObject.emailRecipient,
    subject: 'test',
    text: jsonObject.emailMessage,
  };

  mailTransporter.sendMail(emailMessage, function(error, info){
    if (error) {
      console.log(`Failed to send mail with following error:\n`, error)
      mailResponse.error = error;
    } else {
      console.log(`Email sent: ${emailMessage.to}` + info.response)
      mailResponse.ok = true;
    }
  });
});