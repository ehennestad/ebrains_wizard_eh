import React from 'react';
import Form from '@rjsf/core';
import RichTextWidget from '../../../components/customWidgets';
import {uiSchema} from '../../../helpers/uiSchemaProvider';
import validator from "@rjsf/validator-ajv8";

const SubmissionCompletedWizard = React.memo(({ schema, onReset, onSave }) => {

  return (
    <Form widgets={{richtext: RichTextWidget}} schema={schema} uiSchema={uiSchema} showErrorList={false} omitExtraData={true} validator={validator} >
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="button" className="btn btn-info btn-default" onClick={onReset}>Create another dataset</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="button" className="btn btn-primary" onClick={onSave}>Download Metadata</button></div>
      </div>
    </Form>
  );
});

export default SubmissionCompletedWizard;
