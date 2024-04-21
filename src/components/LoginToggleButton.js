import { Button } from "antd";
import { LoginOutlined, LogoutOutlined, LoadingOutlined } from '@ant-design/icons';

import ConfigProvider from './ConfigProvider';


const LoginToggleButton = ({loading, user, login, logout}) => {
    if (loading) {
        return (
            <ConfigProvider>
                <Button
                    className="custom-button"
                    icon={<LoadingOutlined />}
                    loading
                >
                    Authenticating...
                </Button>
            </ConfigProvider>
        );
    } else {
        return (
            <ConfigProvider>
                <Button
                    className="custom-button"
                    icon={user ? <LogoutOutlined /> : <LoginOutlined />}
                    onClick={user ? logout : login}
                >
                    {user ? 'Logout' : 'Login'}
                </Button>
            </ConfigProvider>
        );
    }
}

export default LoginToggleButton;
