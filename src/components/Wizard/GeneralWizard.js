import React from 'react';
import Form from '@rjsf/core';
import RichTextWidget from '../customWidgets';
import {uiSchema} from '../../helpers/ui-schema-provider';

const GeneralWizard = React.memo(({schema, formData, onSubmit, onChange, loadState, onReset, onTest}) => {

  const handleOnChange = ( {formData} ) => onChange(formData);
  const handleOnSubmit = ( {formData} ) => onSubmit(formData);

  // todo: move to wizard class
  const loadJson = () => {

    let input = document.createElement("input");
    input.type = "file";
    input.accept=".json,application/json";
    input.onchange = _ => {

      let selected = input.files;
      if(selected.length === 1){
        const file = selected[0];
        const reader = new FileReader();

        reader.addEventListener("load", () => {
          let data = JSON.parse(reader.result);          
          let formStates = data[0];
          loadState(formStates);
        }, false);        

        reader.readAsText(file);
      }
    };
    input.click();  
  };

  return (
    <Form widgets={{richtext: RichTextWidget}} schema={schema} uiSchema={uiSchema} formData={formData} omitExtraData={true} onSubmit={handleOnSubmit} onChange={handleOnChange} >
      <div className="footer">
        <div className="col-xs-8 back-panel">
          <button type="button" className="btn btn-default" onClick={onTest}>Test</button>
          <button type="button" className="btn btn-default" onClick={onReset}>Reset</button>
          <button type="button" className="btn btn-default" onClick={loadJson}>Load previous metadata</button>
        </div>
        <div className="col-xs-4 submit-panel">
          <button type="submit" className="btn btn-info btn-primary" name="next">Next Page</button></div>
      </div>
    </Form>
  );
});

export default GeneralWizard;
