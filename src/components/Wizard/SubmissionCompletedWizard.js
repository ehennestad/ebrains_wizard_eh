import React from 'react';
import Form from '@rjsf/core';
import RichTextWidget from '../customWidgets';
import { saveAs } from 'file-saver';

const SubmissionCompletedWizard = React.memo(({ schema, uiSchema, formData, transformErrors, result, dataset, onReset }) => {

  const handleOnSubmit = [];

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify([dataset, result])], {type: "data:text/json;charset=utf-8"});
    saveAs(blob, "result.json")
  };

  return (
    <Form widgets={{richtext: RichTextWidget}} schema={schema} uiSchema={uiSchema} formData={formData} transformErrors={transformErrors} showErrorList={false} omitExtraData={true} onSubmit={handleOnSubmit} >
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="button" className="btn btn-info" onClick={onReset}>Create another dataset</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="button" className="btn btn-success" onClick={downloadJson}>Download Metadata</button></div>
      </div>
    </Form>
  );
});

export default SubmissionCompletedWizard;
