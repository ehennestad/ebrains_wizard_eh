import React from 'react';
import Form from '@rjsf/core';
import TableField from "react-jsonschema-form-extras/lib/table";

const ExperimentWizard = React.memo(({ schema, uiSchema, formData, onSubmit, onBack }) => {

  const handleOnSubmit = ({ formData }) => onSubmit(formData);

  return (
    <Form fields={{table: TableField}} schema={schema} uiSchema={uiSchema} formData={formData} omitExtraData={true} onSubmit={handleOnSubmit} >
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="button" className="btn btn-info" onClick={onBack}>Back</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-info">Next</button></div>
      </div>
    </Form>
  );
});

export default ExperimentWizard;
