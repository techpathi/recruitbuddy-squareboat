import { useEffect, useState } from 'react';
import { List, Avatar, Button, Divider, Input, Form, message } from 'antd';
import handleAccessToken from '../../utilities/handleAccessToken';
import './recruiter-dashboard.css';

const APIENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const RecruiterDashboard = () => {

    const username = localStorage.getItem('username');
    const [applications, updateApplications] = useState([]);
    const [showHidePostJobForm, setShowHidePostJobForm] = useState(false);

    useEffect(() => {
        const authToken = handleAccessToken.getToken();

        async function getApplications() {
            const resp = await fetch(`${APIENDPOINT}/api/v1/application/all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                },
                body: JSON.stringify({ recruiterId: username })
            });
            if (resp.ok) {
                let response = await resp.json();
                updateApplications(response.data);

            }
            else {
                message.error('Looks like there\'s no applications at this moment!');
            }
        }

        getApplications();
    }, []);


    const postJob = async (job) => {
        const authToken = handleAccessToken.getToken();
        const resp = await fetch(`${APIENDPOINT}/api/v1/job`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(job)
        });

        if (resp.ok) {
            message.success('Job posted successfully!');
        }
        else {
            message.error('Looks like you can\'t post this job at this moment!');
        }
        setShowHidePostJobForm(false);

    }


    const onFinishPostJob = (values) => {
        const { jobTitle, jobDesc, jobLocation, companyName, companyLogo } = values;
        const job = {
            jobId: new Date().getTime() + username,
            jobTitle: jobTitle,
            jobDesc: jobDesc,
            location: jobLocation,
            company: companyName,
            companyLogoURL: companyLogo,
            postedBy: username

        }
        postJob(job);
    }

    const postJobForm =
        (
            <Form
                name="postJob"
                className="post-job-form"
                initialValues={{
                }}
                onFinish={onFinishPostJob}
                style={{ margin: '1em' }}
            >
                <Form.Item
                    name="jobTitle"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter job title!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Job title" />
                </Form.Item>
                <Form.Item
                    name="jobDesc"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter job description!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Job description" />
                </Form.Item>
                <Form.Item
                    name="jobLocation"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter job location!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Job location" />
                </Form.Item>
                <Form.Item
                    name="companyName"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter company name!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Company name" />
                </Form.Item>
                <Form.Item
                    name="companyLogo"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter company logo url!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Company logo url" />
                </Form.Item>
                <Form.Item>
                    <Button type="secondary" style={{ marginRight: '10px' }} onClick={() => { setShowHidePostJobForm(false) }} className="post-job-btn">
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" className="post-job-btn">
                        Done
                    </Button>
                </Form.Item>
            </Form>
        );

    return (
        <div className="applications-list-container">
            <div className="post-job-container">
                <Button style={{ margin: '1em' }} type="primary" onClick={() => { setShowHidePostJobForm(true) }} className="post-job-btn">
                    Post new job
                </Button>
                {showHidePostJobForm ? postJobForm : ''}
            </div>
            <List
                itemLayout="vertical"
                size="medium"
                dataSource={applications}
                renderItem={application => (
                    <List.Item
                        key={application.applicationId}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={'http://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon'
                            } />}
                            title={application.fullName}
                            description={application.title}
                        />
                        <Divider />
                        <div style={{ textAlign: 'center' }}>
                            <p>Notice period: <span style={{ fontSize: 'small' }}>{application.noticePeriod} days</span></p>
                            <p>Experience: <span style={{ fontSize: 'small' }}>{application.experience} years</span></p>
                            <a target="blank" href={application.resumeLink}>View resume</a>
                        </div>
                    </List.Item>
                )
                }
            />
        </div>
    );

}
export default RecruiterDashboard;
