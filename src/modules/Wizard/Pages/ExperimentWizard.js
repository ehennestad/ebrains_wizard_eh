import React from 'react';
import Form from '@rjsf/core';
import RichTextWidget, {CustomArrayField} from '../../../components/customWidgets';

import validator from "@rjsf/validator-ajv8";
import {uiSchema} from '../../../helpers/uiSchemaProvider';
import {transformErrors} from '../../../helpers/ErrorTransformer';

//import CascadeSelector from '../../../components/CascadeSelector';
import SubmissionConfirmationModal from '../../../components/SubmissionConfirmationModal';

const ExperimentWizard = ( { schema, formData,  onSubmit, onChange, onError, goBack, formRef, isValid, doShowModal, onSubmissionConfirmed, onSubmissionCanceled} ) => {

  const handleOnChange = ( {formData} ) => onChange(formData);
  const handleOnSubmit = ( {formData} ) => onSubmit(formData);

  return (
    <>
      <Form widgets={{richtext: RichTextWidget}} fields={CustomArrayField} schema={schema} uiSchema={uiSchema} formData={formData} transformErrors={transformErrors} showErrorList={false} omitExtraData={true} onSubmit={handleOnSubmit} onChange={handleOnChange} onError={onError} validator={validator} ref={formRef}>
        <div className="footer">
          <div className="col-xs-5 back-panel">
            <button type="submit" className="btn btn-info btn-default" onClick={goBack}>Previous Page</button>
          </div>
          <div className="col-xs-5 col-xs-offset-2 submit-panel">
            {isValid ? <button type="submit" className="btn btn-info btn-primary">Submit Metadata</button> : <button type="submit" className="btn btn-info btn-primary" title="Please make sure all pages are filled out" disabled>Submit Metadata</button>}
          </div>
        </div>
      </Form>
      <SubmissionConfirmationModal doShowModal={doShowModal} onOk={onSubmissionConfirmed} onCancel={onSubmissionCanceled} />
    </>

  );
};

const ExperimentWizardMemoized = React.memo( ExperimentWizard )
export default ExperimentWizardMemoized;
 