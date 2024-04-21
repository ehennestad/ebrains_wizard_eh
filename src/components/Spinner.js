import { Spin } from 'antd'
import ConfigProvider from './ConfigProvider';
import { useUserContext } from '../contexts/UserContext';

const Spinner = () => {
    
    const { message } = useUserContext();

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh'
    }

    return (
      <div style={containerStyle}>
        <ConfigProvider componentSize={"large"}>
          <Spin size='large' style={{marginBottom:'6rem'}}>
            <h3 style={{marginTop:'10rem'}}>{message ? message : 'Please wait...'}</h3>
            <div className="content" />
          </Spin>
        </ConfigProvider>
     </div>
    )
  }

  export default Spinner;
