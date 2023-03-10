// Todo: Document variables that can be used in the template.

let confirmationEmailTemplate = `Dear \${contactPersonName},

Thank you for submitting metadata for the dataset "\${datasetTitle}". We will review the metadata and get back to you as soon as possible.

The attached file(s) are the metadata you submitted. The json file contains the metadata in a machine-readable format and if you at some point need to make changes to the metadata, you can upload it to the wizard, make modifications and resubmit.

If you have any further questions, do not hesitate to contact the curation team at \${process.env.EMAIL_ADDRESS_CURATION_SUPPORT}\${ticketPrompt}.

Best regards,
EBRAINS Curation Service
curation-support@ebrains.eu

`
// Do not remove or edit this line:
module.exports = confirmationEmailTemplate