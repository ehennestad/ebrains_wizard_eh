import {ConfigProvider} from 'antd';

const EbrainsConfigProvider = ({children, ...props}) => {
    return ( 
        <ConfigProvider
        theme={{
        token: {
            colorPrimary: '#45b07c',
        },
        }}
        {...props}
        >
            {children}
        </ConfigProvider>
    )
}

export default EbrainsConfigProvider
