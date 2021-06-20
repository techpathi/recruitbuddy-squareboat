import { React, useState } from 'react';
import { Menu, Switch } from 'antd';
import { MacCommandOutlined, LogoutOutlined } from '@ant-design/icons';
import handleAccessToken from '../../utilities/handleAccessToken';
import { withRouter } from 'react-router-dom';

const Navbar = ({ history }) => {
    const [theme, setTheme] = useState('dark');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const logOutVisible = isLoggedIn === 'true' ? 'visible' : 'hidden';


    const changeTheme = value => {
        value ? setTheme('dark') : setTheme('light');
    };

    const performCleanLogOut = () => {
        console.log('Logout clik');
        handleAccessToken.delete();
        localStorage.setItem('isLoggedIn', false);
        localStorage.removeItem('userName');
        localStorage.removeItem('role');
        history.push('/login');
    }

    return (
        <Menu mode="horizontal" theme={theme} style={{ width: '100%' }}>
            <Menu.Item key="brand" icon={<MacCommandOutlined />}>
                RecruitBuddy
            </Menu.Item>
            <Menu.Item key="toggleTheme">
                <Switch
                    checked={theme === 'dark'}
                    onChange={changeTheme}
                    checkedChildren="Dark"
                    unCheckedChildren="Light"
                />
            </Menu.Item>
            <Menu.Item key="logout" style={{ visibility: logOutVisible }} onClick={performCleanLogOut} icon={<LogoutOutlined />} >
                Logout
            </Menu.Item>
        </Menu>
    );
}
export default withRouter(Navbar);