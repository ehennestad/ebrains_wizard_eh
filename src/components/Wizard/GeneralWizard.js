import React from 'react';
import Form from '@rjsf/core';
import RichTextWidget from '../customWidgets';

const GeneralWizard = React.memo(({ schema, uiSchema, formData, onSubmit }) => {

  const handleOnSubmit = ({ formData }) => onSubmit(formData);

  return (
    <Form widgets={{richtext: RichTextWidget}} schema={schema} uiSchema={uiSchema} formData={formData} omitExtraData={true} onSubmit={handleOnSubmit} >
      <div className="footer">
        <div className="col-xs-5 back-panel">
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-info">Next</button></div>
      </div>
    </Form>
  );
});

export default GeneralWizard;
