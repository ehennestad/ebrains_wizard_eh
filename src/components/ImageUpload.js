import React, { useState } from 'react';
import { ConfigProvider, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const ImageUpload = ({oldFileList, onImageUploadedFcn}) => {

  const [fileList, setFileList] = useState(oldFileList);
  
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    onImageUploadedFcn(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Image must smaller than 5MB!');
    }
    // return isJpgOrPng && isLt2M;
    // Note: If the return value is true, there is an error in te web app...
    return false;
  };

  const uploadButton = (
    <Button icon={<UploadOutlined />}>Upload</Button>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#45b07c',
        },
      }}
    >
      <div style={{"marginBottom":"30px"}}>
        <ImgCrop rotate>
          <Upload
            action=""
            listType="picture"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={onChange}
            onPreview={onPreview}
            className="upload-list-inline"
          >
            {fileList.length >= 1 ? null : uploadButton}
            {/* <Button icon={<UploadOutlined />}>Upload</Button> */}
          </Upload>
        </ImgCrop>
      </div>
    </ConfigProvider>

  );
};
export default ImageUpload;