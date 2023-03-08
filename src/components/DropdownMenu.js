import { DownloadOutlined, UploadOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import ConfigProvider from './ConfigProvider';

const items = [
  {
    label: 'Upload form data',
    key: '1',
    icon: <UploadOutlined />,
  },
  {
    label: 'Save metadata to file...',
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
  
  const handleButtonClick = (e) => {
    handleMenuSelection('Download form data')
    };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
  <Space wrap>
      <ConfigProvider componentSize={"large"}>
        <Dropdown.Button menu={menuProps} onClick={handleButtonClick} icon={<MenuOutlined />}>
        Download form data
        </Dropdown.Button>
      </ConfigProvider>
  </Space>
  )
};

export default DropdownMenu;
