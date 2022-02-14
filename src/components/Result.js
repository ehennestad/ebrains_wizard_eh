import React from 'react';
import ReactJson from 'react-json-view';
import { saveAs } from 'file-saver';

const Result = React.memo(({result, dataset, onBack, onReset, loadState}) => {

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify([dataset, result])], {type: "data:text/json;charset=utf-8"});
    saveAs(blob, "result.json")
  };

  const loadJson = () => {

    let input = document.createElement("input");
    input.type = "file";
    input.accept=".json,application/json";
    input.onchange = _ => {

      let selected = input.files;
      if(selected.length === 1){
        const file = selected[0];
        const reader = new FileReader();

        reader.addEventListener("load", () => {
          let data = JSON.parse(reader.result);          
          let formStates = data[0];
          loadState(formStates);
        }, false);        

        reader.readAsText(file);
      }
    };
    input.click();  
  };

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
          <button className="btn btn-success download-btn" onClick={downloadJson}>Save your entries as JSON</button>
          <button className="btn btn-info loaddata-btn" onClick={loadJson}>Load previous metadata</button>
          <button className="btn btn-info" onClick={onReset}>Create another dataset</button>
        </div>
      </div>
    </div>
  );
});

export default Result;