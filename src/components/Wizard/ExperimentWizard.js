import React from 'react';
import Form from '@rjsf/core';
import TableField from "react-jsonschema-form-extras/lib/table";
import RichTextWidget from '../customWidgets';

const ExperimentWizard = React.memo(({ schema, uiSchema, formData, transformErrors, onSubmit, onBack }) => {

  const handleOnSubmit = ({ formData }) => onSubmit(formData);

  return (
    <Form widgets={{richtext: RichTextWidget}} fields={{table: TableField}} schema={schema} uiSchema={uiSchema} formData={formData} transformErrors={transformErrors} showErrorList={false} omitExtraData={true} onSubmit={handleOnSubmit} >
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="button" className="btn btn-info" onClick={onBack}>Back</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-success">Submit Metadata</button></div>
      </div>
    </Form>
  );
});

export default ExperimentWizard;
