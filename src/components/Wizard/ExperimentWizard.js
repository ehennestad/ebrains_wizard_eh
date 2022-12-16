import React from 'react';
import Form from '@rjsf/core';
import TableField from "react-jsonschema-form-extras/lib/table";
import RichTextWidget from '../customWidgets';
import {uiSchema} from '../../helpers/Wizard';

import {transformErrors} from '../../helpers/ErrorTransformer';

const ExperimentWizard = React.memo(({ schema, formData,  onSubmit, onChange, goBack }) => {

  const handleOnChange = ( {formData} ) => onChange(formData);
  const handleOnSubmit = ( {formData} ) => onSubmit(formData);

  return (
    <Form widgets={{richtext: RichTextWidget}} fields={{table: TableField}} schema={schema} uiSchema={uiSchema} formData={formData} transformErrors={transformErrors} showErrorList={false} omitExtraData={true} onSubmit={handleOnSubmit} onChange={handleOnChange}>
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="submit" className="btn btn-info btn-prev" onClick={goBack}>Previous Page</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-success">Submit Metadata</button></div>
      </div>
    </Form>
  );
});

export default ExperimentWizard;
