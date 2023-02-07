import { Modal } from 'antd';
import { useState } from 'react';
import ConfigProvider from './ConfigProvider';
import ConfirmationPrompt from '../textModules/ConfirmSubmissionPrompt';


const App = ( {doShowModal, onOk, onCancel} ) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOk = ( evtData ) => onOk()
  const handleCancel = ( evtData ) => onCancel()

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <ConfigProvider>
      {doShowModal && !isModalOpen ? showModal() : null }
      <Modal title="Confirm Submission" open={doShowModal} onOk={handleOk} onCancel={handleCancel} cancelText={"Review"} okText={"Submit"} centered>
        <ConfirmationPrompt/>
      </Modal>
    </ConfigProvider>
  );
};
export default App;