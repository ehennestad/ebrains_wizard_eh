// This script creates a transport object which can be used to send emails

//  This script requires the following environment variables to be set:
//  - RELAY_HOST (production)

// In order to use this script locally, you need to create a file called 
// mail_credentials.js in the same folder as this script. Use the following
// template for the file: mail_credentials_template.js
// Make sure to add the file to .gitignore so that you don't commit your
// credentials to the repository.

const nodemailer = require('nodemailer');  // Nodemailer is used for sending emails

// Define the smtp server to use and the user credentials

// For local development (get credentials from a config file):
// Todo: Add a check for the environment variable NODE_ENV instead of the user
if (process.env.USER==='eivinhen' || process.env.USER==='Eivind') {
    const creds = require('./mail_credentials');
    var transportConfiguration = {
      host: 'smtp.gmail.com', // e.g. smtp.gmail.com
      auth: {
        user: creds.USER,
        pass: creds.PASS
      }
    }
}

// For production (use the mail relay)
else {
    var transportConfiguration = {
      host: process.env.RELAY_HOST,
      port: 25,
      secure: false, // Don't use TLS
      tls: {rejectUnauthorized: false}
    };
}

var mailTransporter = nodemailer.createTransport(transportConfiguration)

mailTransporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Successfully created a mail transporter');
  }
});

module.exports = mailTransporter;
