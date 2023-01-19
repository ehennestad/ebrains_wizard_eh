import React from 'react';
import Form from '@rjsf/core';
import {uiSchema} from '../../helpers/ui-schema-provider';

import {transformErrors} from '../../helpers/ErrorTransformer';

const ContributorsWizard = React.memo(({ schema, formData, onSubmit, onChange, goBack }) => {
  
  const handleOnChange = ( {formData} ) => onChange(formData);
  const handleOnSubmit = ( {formData} ) => onSubmit(formData);

  return (
    <Form schema={schema} uiSchema={uiSchema} formData={formData} omitExtraData={true} transformErrors={transformErrors} showErrorList={false} onSubmit={handleOnSubmit} onChange={handleOnChange}>
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="button" className="btn btn-info btn-default" onClick={goBack}>Previous Page</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-info btn-primary">Next Page</button></div>
      </div>
    </Form>
  );
});

export default ContributorsWizard;
