import React from 'react';
import Form from '@rjsf/core';
import TableField from "react-jsonschema-form-extras/lib/table";
import RichTextWidget from '../customWidgets';
import {uiSchema} from '../../helpers/ui-schema-provider';

import {transformErrors} from '../../helpers/ErrorTransformer';
import CascadeSelector from '../CascadeSelector';

const studyTargetTerms = require('../../../server/kg-util/constants');
const getControlledTerms = require('../../../server/kg-util/getControlledTerms');

const controlledTerms = getControlledTerms(studyTargetTerms)


const ExperimentWizard = React.memo(({ schema, formData,  onSubmit, onChange, goBack }) => {

  const handleOnChange = ( {formData} ) => onChange(formData);
  const handleOnSubmit = ( {formData} ) => onSubmit(formData);

  return (
    <Form widgets={{richtext: RichTextWidget}} fields={{table: TableField}} schema={schema} uiSchema={uiSchema} formData={formData} transformErrors={transformErrors} showErrorList={false} omitExtraData={true} onSubmit={handleOnSubmit} onChange={handleOnChange}>
      <CascadeSelector/>
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="submit" className="btn btn-info btn-default" onClick={goBack}>Previous Page</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-info btn-primary">Submit Metadata</button></div>
      </div>
    </Form>
  );
});

export default ExperimentWizard;
