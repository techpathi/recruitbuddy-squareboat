import React, { useEffect, useState } from 'react';
import { List, Avatar, Button, Form, Input, message, Collapse } from 'antd';
import './candidate-dashboard.css';
import handleAccessToken from '../../utilities/handleAccessToken';

const APIENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const CandidateDashboard = () => {

    const { Search } = Input;
    const username = localStorage.getItem('username');
    const [jobToApply, setJobToApply] = useState(null);
    const [jobResults, setJobResults] = useState([]);
    const [jobsToDisplay, setjobsToDisplay] = useState([]);
    const [showApplyForm, setshowApplyForm] = useState(false);
    console.log('Job to apply:', jobToApply);

    useEffect(() => {
        async function getAllJobs() {
            const authToken = handleAccessToken.getToken();
            const resp = await fetch(`${APIENDPOINT}/api/v1/job`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken
                }
            });
            if (resp.ok) {
                const jobs = await resp.json();
                setJobResults(jobs.data);
                setjobsToDisplay(jobs.data)
            }
            else {
                message.error('Looks like we can\'t fetch the applications at this moment!');
            }
        }
        getAllJobs();
    }, []);

    const applyJob = async (job, experience, noticePeriod, resumeLink) => {
        console.log(job.jobId);
        let newJob = {
            applicationId: job.jobId + username,
            jobId: job.jobId,
            appliedBy: username,
            experience: experience,
            noticePeriod: noticePeriod,
            resumeLink: resumeLink,
            postedBy: job.username
        }
        console.log(JSON.stringify(newJob));
        const authToken = handleAccessToken.getToken();
        const resp = await fetch(`${APIENDPOINT}/api/v1/application`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(newJob)
        });

        if (resp.ok) {
            message.success('Application sent successfully!');
        }
        else {
            message.error('Looks like you already applied for this job!');
        }
    }

    const onFinishApplyForm = (values) => {
        const { experience, noticePeriod, resumeLink } = values;
        applyJob(jobToApply, experience, noticePeriod, resumeLink);
    }

    const getSearchResults = (searchkey) => {
        console.log(jobResults);
        return jobResults.filter((job) => {
            console.log(job.title, job.desc, job.fullName);
            return (job.title.toLowerCase().includes(searchkey.toLowerCase()) ||
                job.desc.toLowerCase().includes(searchkey.toLowerCase()) ||
                job.fullName.toLowerCase().includes(searchkey.toLowerCase())
            );
        }
        );
    }


    const handleOnChange = async () => {
        let searchkey = document.getElementById("search-box").value;
        if (searchkey.length > 2) {
            let search = await getSearchResults(searchkey);
            console.log('Search res', search);
            if (search.length > 0)
                setjobsToDisplay(search);
        } else {
            console.log('Actual jobs', jobResults);
            setjobsToDisplay(jobResults);
        }
    }


    const applicationDetailsForm =
        (
            <Form
                name="applyJob"
                className="apply-form"
                initialValues={{
                }}
                onFinish={onFinishApplyForm}
            >
                <Form.Item
                    name="experience"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your experience!',
                        },
                    ]}
                >
                    <Input type="number" placeholder="Experience (in years)" />
                </Form.Item>
                <Form.Item
                    name="noticePeriod"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your notice period!',
                        },
                    ]}
                >
                    <Input type="number" placeholder="Notice period (in days)" />
                </Form.Item>
                <Form.Item
                    name="resumeLink"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter link to your resume!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Resume URL" />
                </Form.Item>
                <Form.Item>
                <Button type="secondary" style={{marginRight:'1em'}} onClick={()=>{setshowApplyForm(false)}} className="apply-job-btn">
                        Close
                    </Button>
                    <Button type="primary" htmlType="submit" className="apply-job-btn">
                        Done
                    </Button>
                </Form.Item>
            </Form>
        );

    if (jobsToDisplay.length <= 0) {
        return <h2 style={{ textAlign: 'center', marginTop: '20%' }}>Getting what you ask, hold on</h2>
    }
    else {
        return (
            <div className="jobs-list-container">
                <Search id="search-box" placeholder="Search by job title, description, recruiter" onChange={handleOnChange} />
                <React.Fragment>
                    <List
                        itemLayout="vertical"
                        size="medium"
                        dataSource={jobsToDisplay}
                        renderItem={job => (
                            <List.Item
                                key={job.title}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={job.companyLogoURL} />}
                                    title={job.title}
                                    description={`${job.company}, ${job.location}`}
                                />
                                <p style={{ fontWeight: 'bold' }}>Job Description</p>
                                {job.desc}
                                <p>Posted by <span style={{ fontWeight: 'bold' }} >{job.fullName}</span> on {job.createdAt}</p>
                                <Button style={{ marginBottom: '10px' }} type="primary" htmlType="submit" onClick={() => { setshowApplyForm(true); setJobToApply(job) }} className="apply-job-btn">
                                    Apply for this job
                                </Button>
                                {showApplyForm ? applicationDetailsForm : ''}
                            </List.Item>
                        )}
                    />
                </React.Fragment>
            </div>
        );
    }

}

export default CandidateDashboard;
