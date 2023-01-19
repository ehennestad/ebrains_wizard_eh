import React, {useState} from 'react';
import { ConfigProvider, Popover, Steps } from 'antd';

// Todo: import these from external file (also do this in Wizard.js)
//const WIZARD_STEPS_LIST = [ WIZARD_STEP_GENERAL, WIZARD_STEP_DATASET, WIZARD_STEP_FUNDING, WIZARD_STEP_CONTRIBUTORS, WIZARD_STEP_EXPERIMENT ];
const WIZARD_STEP_NAMES = [ "Introduction", "Dataset part 1", "Dataset part 2", "Funding", "Contributors", "Experiments" ];
const NUM_STEPS = WIZARD_STEP_NAMES.length;

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        Step {index+1} of {NUM_STEPS} - Status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);
const description = '';

const ProgressBar = ({step, onChanged}) => {
//const ProgressBar = ({step, status, onChanged}) => {

  const [current, setCurrent] = useState(0);
  
  const onChange = (value) => {
    setCurrent(value);
    onChanged(value);
  };

  let items = [];

  for (let i = 0; i < NUM_STEPS; i++) {
      let thisItem = {
          title: WIZARD_STEP_NAMES[i],
          //status: status[i],
          description,
      };
      items.push(thisItem);
  }

  return (

  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#45b07c',
      },
    }}
  >
     <div style={{"marginBottom":"30px"}}>
      <Steps
          current={step}
          //status={status[step]}
          onChange={onChange}
          progressDot={customDot}
          items={items}
      />
    </div>
  </ConfigProvider>
  );
};
export default ProgressBar;
