import { Select, Space } from 'antd';
import { useState } from 'react';
import ConfigProvider from './ConfigProvider';

const App = (controlledTermsGroup) => {

  controlledTermsGroup = controlledTermsGroup.controlledTermsGroup;
  let termNames = Object.keys(controlledTermsGroup)
  console.log('termNames', termNames)

  const [terms, setTerms] = useState(controlledTermsGroup[termNames[0]]);
  const [instances, setInstances] = useState(controlledTermsGroup[termNames[0]][0].name);
  const handleTermChange = (value) => {
    setTerms(controlledTermsGroup[value]);
    setInstances(controlledTermsGroup[value][0].name);
  };
  const onInstanceChange = (value) => {
    setInstances(value);
  };
  
  return (
    <ConfigProvider>
      <Space wrap>
        <Select
          defaultValue={termNames[0]}
          style={{
            minWidth: 200,
          }}
          onChange={handleTermChange}
          options={termNames.map((instance) => ({
            label: instance,
            value: instance,
          }))}
        />
        <Select
          style={{
            minWidth: 240,
          }}
          value={instances}
          onChange={onInstanceChange}
          options={terms.map((term) => ({
            label: term.name,
            value: term.name,
          }))}
        />
      </Space>
    </ConfigProvider>
  );
};
export default App;