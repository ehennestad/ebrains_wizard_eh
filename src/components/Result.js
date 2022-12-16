import React from 'react';
import ReactJson from 'react-json-view';
import { saveAs } from 'file-saver';
import axios from 'axios';


const Result = React.memo(({result, dataset, subjectExcelFile, onBack, onReset, storeExcelFile}) => {

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify([dataset, result])], {type: "data:text/json;charset=utf-8"});
    saveAs(blob, "ebrains_wizard_metadata.json")
  };

  const onSubmitMetadataButtonClicked = () => {
    
    // Create a json string from data which user has entered.
    var jsonData = JSON.stringify([dataset, result]);

    // Create a FormData object in order to send data and files to the backend server
    let formData = new FormData();
    formData.append('excelFile', subjectExcelFile);
    formData.append('jsonData', jsonData)
    
    // Route the POST request with files+data to api/sendmail
    axios.post('/api/sendmail', formData)
  };

  const onUploadExcelFileButtonClicked = () => {

    // Create an element for receiving a file input.
    let input = document.createElement("input");
    input.type = "file";
    input.accept=".xlsx,application/excel";
    
    input.onchange = _ => {
      let selected = input.files;
      if(selected.length === 1){
        const file = selected[0];
        storeExcelFile(file)
      }
    };

    input.click(); // Trigger the input to open a file dialog
  }; // end onUploadXlsClicked

  return (
    <div className="result">
      <div className="container">
        <div className="col-md-12">
          <ReactJson collapsed={1} name={false} src={result} />
        </div>
      </div>
      <div className="container">
        <div className="col-md-2">
          <button type="button" className="btn btn-info" onClick={onBack}>Back</button>
        </div>
        <div className="col-md-8 col-md-offset-2">
          <button className="btn btn-info loaddata-btn" onClick={onUploadExcelFileButtonClicked}>Upload excel file</button>
          <button className="btn btn-success download-btn" onClick={onSubmitMetadataButtonClicked}>Submit metadata</button>
          <button className="btn btn-info loaddata-btn" onClick={downloadJson}>Save your entries as JSON</button>
          <button className="btn btn-info" onClick={onReset}>Create another dataset</button>
        </div>
      </div>
    </div>
  );
});

export default Result;