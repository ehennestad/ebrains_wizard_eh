import React from 'react';
import Form from '@rjsf/core';
import RichTextWidget from '../../../components/customWidgets';
import {uiSchema} from '../../../helpers/uiSchemaProvider';
import validator from "@rjsf/validator-ajv8";

const GeneralWizard = React.memo(({schema, formData, onSubmit, onChange, loadState, onReset, formRef}) => {

  const handleOnChange = ( {formData} ) => onChange(formData);
  const handleOnSubmit = ( {formData} ) => onSubmit(formData);
  
  return (
    <Form widgets={{richtext: RichTextWidget}} schema={schema} uiSchema={uiSchema} formData={formData} omitExtraData={true} onSubmit={handleOnSubmit} onChange={handleOnChange} validator={validator} ref={formRef}>
      <div className="footer">
        <div className="col-xs-8 back-panel">
          <button type="button" className="btn btn-default" onClick={onReset}>Reset</button>
          <button type="button" className="btn btn-default" onClick={loadState}>Load previous metadata</button>
        </div>
        <div className="col-xs-4 submit-panel">
          <button type="submit" className="btn btn-info btn-primary" name="next" title="Please">Next Page</button></div>
      </div>
    </Form>
  );
});

export default GeneralWizard;
