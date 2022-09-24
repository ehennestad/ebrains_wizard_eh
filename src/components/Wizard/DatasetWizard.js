import React from 'react';
import Form from '@rjsf/core';
import {ImageWidget, RichTextWidget} from '../customWidgets';
import {uiSchema} from '../../helpers/Wizard';

import {transformErrors} from '../../helpers/ErrorTransformer';


const DatasetWizard = React.memo(({ schema, formData, onSubmit, onChange, goBack}) => {

  const handleOnChange = ( {formData} ) => onChange(formData);
  const handleOnSubmit = ( {formData} ) => onSubmit(formData);

  return (
    <Form widgets={{img: ImageWidget, richtext: RichTextWidget}} schema={schema} uiSchema={uiSchema} formData={formData} transformErrors={transformErrors} showErrorList={false} omitExtraData={true} onSubmit={handleOnSubmit} onChange={handleOnChange} >
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="button" className="btn btn-info" onClick={goBack}>Back</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-info" >Next</button></div>
      </div>
    </Form>
  );
});

export default DatasetWizard;
