import { Select, Space } from 'antd';
import { useState } from 'react';
import ConfigProvider from './ConfigProvider';

const App = (controlledTermsGroup) => {

  termNames = Object.keys(controlledTermsGroup)

  const [terms, setTerms] = useState(controlledTermsGroup[termNames[0]]);
  const [instances, setInstances] = useState(controlledTermsGroup[termNames[0]][0]);
  const handleTermChange = (value) => {
    setTerms(controlledTermsGroup[value]);
    setInstances(controlledTermsGroup[value][0]);
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
            width: 120,
          }}
          onChange={handleTermChange}
          options={termNames.map((instance) => ({
            label: instance,
            value: instance,
          }))}
        />
        <Select
          style={{
            width: 120,
          }}
          value={instances}
          onChange={onInstanceChange}
          options={terms.map((term) => ({
            label: term,
            value: term,
          }))}
        />
      </Space>
    </ConfigProvider>
  );
};
export default App;