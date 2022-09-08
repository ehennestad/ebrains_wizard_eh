// This script creates a transport object which can be used to send emails

const nodemailer = require('nodemailer');  // Nodemailer is used for sending emails

// Define the smtp server to use and the user credentials

// For local development (get credentials from a config file):
if (process.env.USER=='eivinhen') {
    const creds = require('./mail_credentials');
    var transportConfiguration = {
      host: 'smtp.gmail.com', // e.g. smtp.gmail.com
      auth: {
        user: creds.USER,
        pass: creds.PASS
      }
    }
}
// For production (get credentials from environment variables)
else {
  var transportConfiguration = {
    host: 'smtp.gmail.com', // e.g. smtp.gmail.com
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  }
}

var mailTransporter = nodemailer.createTransport(transportConfiguration)

mailTransporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Successfully connected to the SMTP server');
  }
});

module.exports = mailTransporter;