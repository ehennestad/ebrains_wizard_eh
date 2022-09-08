import React from 'react';
import Form from '@rjsf/core';
import RichTextWidget from '../customWidgets';

const GeneralWizard = React.memo(({schema, uiSchema, formData, onSubmit, loadState}) => {

  const handleOnSubmit = ({ formData }) => onSubmit(formData);

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
    <Form widgets={{richtext: RichTextWidget}} schema={schema} uiSchema={uiSchema} formData={formData} omitExtraData={true} onSubmit={handleOnSubmit} >
      <div className="footer">
        <div className="col-xs-5 back-panel">
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="button" className="btn btn-info loaddata-btn" onClick={loadJson}>Load previous metadata</button>
          <button type="submit" className="btn btn-info">Next</button></div>
      </div>
    </Form>
  );
});

export default GeneralWizard;
