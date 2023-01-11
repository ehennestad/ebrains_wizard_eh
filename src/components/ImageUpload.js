import React, { useState } from 'react';
import { ConfigProvider, Button, Upload } from 'antd';
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