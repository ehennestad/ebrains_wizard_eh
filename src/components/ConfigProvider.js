import {ConfigProvider} from 'antd';


export default (props) => {
    return ( 
        <ConfigProvider
        theme={{
        token: {
            colorPrimary: '#45b07c',
        },
        }}
        >
            {props.children}
        </ConfigProvider>
    )
}
