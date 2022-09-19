// This script creates a transport object which can be used to send emails

const nodemailer = require('nodemailer');  // Nodemailer is used for sending emails
// const smtpTransport = require('nodemailer-smtp-transport');

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
// For production (use the cscs mail relay)
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