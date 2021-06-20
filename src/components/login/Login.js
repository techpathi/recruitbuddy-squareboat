import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import './login.css';
import { useDispatch } from 'react-redux';
import { loginUserAsync } from '../../redux/userSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import handleAccessToken from '../../utilities/handleAccessToken';


const Login = ({ history }) => {

    const dispatch = useDispatch();

    const user = useSelector((state) => state.users);
    if (user.error) {
        message.error('Login failed! Kindly recheck your credentials');
    }
    else if (user.token) {
        handleAccessToken.save(user.token);
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);
        if (user.role === 'R') {
            history.push('/recruiterDashboard')
        }
        else if (user.role === 'J') {
            history.push('/candidateDashboard');
        }
        localStorage.setItem("isLoggedIn", true);
    }

    useEffect(() => {
        dispatch(loginUserAsync);
    }, [dispatch]);

    const onFinish = (values) => {
        dispatch(
            loginUserAsync({
                username: values.username,
                password: values.password
            })
        );

    };

    return (
        <div className="login-container">
            <Card className="card">
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <a href="/signup">register now!</a>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
