import React, {useState} from 'react';
import { ConfigProvider, Popover, Steps } from 'antd';

// Todo: import these from external file (also do this in Wizard.js)
//const WIZARD_STEPS_LIST = [ WIZARD_STEP_GENERAL, WIZARD_STEP_DATASET, WIZARD_STEP_FUNDING, WIZARD_STEP_CONTRIBUTORS, WIZARD_STEP_EXPERIMENT ];
const WIZARD_STEP_NAMES = [ "Introduction", "Dataset", "Dataset2", "Funding", "Contributors", "Experiments" ];
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

  const [current, setCurrent] = useState(0);
  const onChange = (value) => {
    console.log('onChange:', current);
    console.log('new:', value);

    setCurrent(value);
    onChanged(value);
  };
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
          onChange={onChange}
          progressDot={customDot}

          //TODO: create this list dynamically from WIZARD_STEPS_LIST
          items={[
          {
              title: WIZARD_STEP_NAMES[0],
              description,
          },
          {
              title: WIZARD_STEP_NAMES[1],
              description,
          },
          {
              title: WIZARD_STEP_NAMES[2],
              description,
          },
          {
              title: 'Affiliation',
              description,
          },
          {
              title: WIZARD_STEP_NAMES[3],
              description,
          },
          {
              title: WIZARD_STEP_NAMES[4],
              description,
          },
          ]}
      />
    </div>
  </ConfigProvider>
  );
};
export default ProgressBar
;