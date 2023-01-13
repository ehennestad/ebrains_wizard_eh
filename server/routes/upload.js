const express       = require('express');               // Express is a framework for creating web apps

// Get dependencies that are needed for the submission route
const fileUpload    = require('express-fileupload');    // Middleware for uploading file content / parsing multiform data in requests
const path          = require('path');                  // Path is used for creating file paths
const fs            = require('fs');                    // fs is needed for reading files from the file system

// Create a router to handle requests
const router = express.Router();            

const uploadOptions = { limits: { fileSize: 50 * 1024 * 1024 }, debug:true, useTempFiles:true } // restrict size of uploaded files to 50 MB
router.use( fileUpload(uploadOptions) );

// Export the router so it can be used in the main app
module.exports = router;

router.post('/previewImage', (req, res) => {
    console.log('Received post-request for upload of preview image from client')
    //console.log(req.files.file)
  
    let saveDirPath = path.join(__dirname, '..', "/tmp", "/upload")
    let saveFilePath = path.join(saveDirPath, req.files.file.name)

    fs.mkdirSync(saveDirPath, { recursive: true })
    fs.writeFile( saveFilePath, req.files.file.data, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log("File written successfully\n");
            let responseObject = {
                "name": req.files.file.name,
                "status": "done",
                "url": "",
                "thumbUrl": ""
            };
            res.send( responseObject );
        }
    });
});
