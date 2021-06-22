import { Form, Input, message, Button, Switch } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import '../login/login.css';
import { useDispatch } from 'react-redux';
import { registerUserAsync } from '../../redux/userSlice';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

const SignUp = () => {

    const dispatch = useDispatch();

    const [recruiterSignUp, setrecruiterSignup] = useState(false);

    const user = useSelector((state) => state.users);
    console.log('User: ' + user.length);
    if (user.length > 0 && !user.error) {
        message.success('Signup success');
        <Redirect to="/login" />
    }
    else if (user & user.error) {
        message.error(user.message);
    }

    useEffect(() => {
        dispatch(registerUserAsync);
    }, [dispatch]);

    const onFinish = (values) => {

        let { username, password, passwordConfirm, fullname } = values;

        if (password !== passwordConfirm) {
            message.error('Password and confirm password should match');
        }
        else {
            message
                .loading('Signup in progress..', 2,
                    () => { message.success('Sign up success! You may login now.', 1) });
            dispatch(
                registerUserAsync({
                    username: username,
                    password: password,
                    fullName: fullname,
                    role: recruiterSignUp ? 'R' : 'J'
                })
            );
        }
    };

    const toggleRecruiter = () => {
        let status = recruiterSignUp ? false : true
        setrecruiterSignup(status);
    }

    return (
        <div className="login-container">
            <Card className="card">
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={null}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="fullname"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your full name!',
                            },
                        ]}
                    >
                        <Input prefix={<IdcardOutlined className="site-form-item-icon" />} placeholder="Full name" />
                    </Form.Item>
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
                    <Form.Item
                        name="passwordConfirm"
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Confirm Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Switch onChange={toggleRecruiter} style={{ marginRight: '10px' }} />
                        I am here to hire
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Sign up
                        </Button>
                        Or <a href="/login">Login now!</a>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default SignUp;
