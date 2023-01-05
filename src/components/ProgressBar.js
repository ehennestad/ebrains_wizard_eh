import React from 'react';
import { ConfigProvider, Popover, Steps } from 'antd';

// Todo: import these from external file (also do this in Wizard.js)
//const WIZARD_STEPS_LIST = [ WIZARD_STEP_GENERAL, WIZARD_STEP_DATASET, WIZARD_STEP_FUNDING, WIZARD_STEP_CONTRIBUTORS, WIZARD_STEP_EXPERIMENT ];
const WIZARD_STEP_NAMES = [ "Introduction", "Dataset", "Funding", "Contributors", "Experiments" ];
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

const ProgressBar = ({step}) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#45b07c',
      },
    }}
  >
    <Steps
        current={step}
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
        // {
        //     title: 'Affiliation',
        //     description,
        // },
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
  </ConfigProvider>
);
export default ProgressBar
;