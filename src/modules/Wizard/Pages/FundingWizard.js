import React from 'react';
import Form from '@rjsf/core';
import {uiSchema} from '../../../helpers/uiSchemaProvider';
import validator from "@rjsf/validator-ajv8";
import {CustomArrayField} from '../../../components/customWidgets';

const FundingAndAffiliationWizard = React.memo(({ schema, formData, onSubmit, onChange, goBack }) => {

  const handleOnChange = ( {formData} ) => onChange(formData);
  const handleOnSubmit = ( {formData} ) => onSubmit(formData);

  return (
    <Form fields={CustomArrayField} schema={schema} uiSchema={uiSchema} formData={formData} omitExtraData={true} onSubmit={handleOnSubmit} onChange={handleOnChange} validator={validator}>
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="submit" className="btn btn-info btn-default" onClick={goBack}>Previous Page</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-info btn-primary">Next Page</button></div>
      </div>
    </Form>
  );
});

export default FundingAndAffiliationWizard;