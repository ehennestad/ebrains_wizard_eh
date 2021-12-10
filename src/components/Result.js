import React from 'react';
import ReactJson from 'react-json-view';
import { saveAs } from 'file-saver';

const Result = React.memo(({ result, onBack, onReset}) => {

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(result)], {type: "data:text/json;charset=utf-8"});
    saveAs(blob, "result.json")
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
          <button className="btn btn-success download-btn" onClick={downloadJson}>Download JSON</button>
          <button className="btn btn-info" onClick={onReset}>Create another dataset</button>
        </div>
      </div>
    </div>
  );
});

export default Result;