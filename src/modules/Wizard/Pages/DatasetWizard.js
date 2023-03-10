import React from 'react';
import Form from '@rjsf/core';
import {ImageWidget, RichTextWidget, CustomArrayField} from '../../../components/customWidgets';
import ImageUpload from '../../../components/ImageUpload';

import validator from "@rjsf/validator-ajv8";
import {uiSchema} from '../../../helpers/uiSchemaProvider';
import {transformErrors} from '../../../helpers/ErrorTransformer';


//const DatasetWizard = React.memo(({ schema, formData, onSubmit, onChange, goBack}) => {
const DatasetWizard = ({ schema, formData, onSubmit, onChange, onError, goBack, imageFileList, imageUploadedFcn, formRef}) => {

  const handleOnChange = ( {formData} ) => onChange(formData);
  const handleOnSubmit = ( {formData} ) => onSubmit(formData);
  
  let imageUploader = (
    <ImageUpload oldFileList = {imageFileList} onImageUploadedFcn = {imageUploadedFcn}/>
  );
  
  return (
    <Form fields={CustomArrayField} widgets={{img: ImageWidget, richtext: RichTextWidget}} schema={schema} uiSchema={uiSchema} formData={formData} transformErrors={transformErrors} showErrorList={false} omitExtraData={true} onSubmit={handleOnSubmit} onChange={handleOnChange} onError={onError} validator={validator} ref={formRef}>
      
      {imageFileList === undefined ? null : imageUploader}
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="button" className="btn btn-info btn-default" onClick={goBack}>Previous Page</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-info btn-primary" >Next Page</button></div>
      </div>
    </Form>
  );
};


//const DatasetWizardMemoized = React.memo( DatasetWizard )

export default DatasetWizard;
