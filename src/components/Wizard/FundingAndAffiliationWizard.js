import React from 'react';
import Form from '@rjsf/core';
import {uiSchema} from '../../helpers/Wizard';

const FundingAndAffiliationWizard = React.memo(({ schema, formData, onSubmit, onChange, goBack }) => {

  const handleOnChange = ( {formData} ) => onChange(formData);
  const handleOnSubmit = ( {formData} ) => onSubmit(formData);

  return (
    <Form schema={schema} uiSchema={uiSchema} formData={formData} omitExtraData={true} onSubmit={handleOnSubmit} onChange={handleOnChange}>
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="submit" className="btn btn-info" onClick={goBack}>Back</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-info">Next</button></div>
      </div>
    </Form>
  );
});

export default FundingAndAffiliationWizard;
