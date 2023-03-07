import { DownloadOutlined, UploadOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Tooltip } from 'antd';
import ConfigProvider from './ConfigProvider';

const handleButtonClick = (e) => {
  message.info('Click on left button.');
  console.log('click left button', e);
};

const items = [
  {
    label: 'Load metadata from file',
    key: '1',
    icon: <UploadOutlined />,
  },
  {
    label: 'Save metadata to file',
    key: '2',
    icon: <DownloadOutlined />,
  },
  {
    label: 'Reset form',
    key: '3',
    icon: <DeleteOutlined />,
  },
];



const DropdownMenu = ({handleMenuSelection}) => {

  const handleMenuClick = (item) => { 
    handleMenuSelection(items[item.key - 1].label) }
  
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
  <Space wrap>
      <ConfigProvider componentSize={"large"}>
        <Dropdown.Button menu={menuProps} onClick={handleButtonClick} icon={<MenuOutlined />}>
        Dropdown
        </Dropdown.Button>
      </ConfigProvider>
  </Space>
  )
};

export default DropdownMenu;
