import React, { useEffect, useState } from 'react';
import { List, Avatar, Button, Form, Input, message, Divider, Space } from 'antd';
import './candidate-dashboard.css';
import handleAccessToken from '../../utilities/handleAccessToken';
import $ from 'jquery';

const APIENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const CandidateDashboard = () => {

    const { Search } = Input;
    const username = localStorage.getItem('username');
    const [jobToApply, setJobToApply] = useState(null);
    const [jobResults, setJobResults] = useState([]);
    const [jobsToDisplay, setjobsToDisplay] = useState([]);
    const [formIndex, setFormIndex] = useState(-1);

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

    function readMore() {
        var dots = document.getElementById("dots");
        var moreText = document.getElementById("more");
        var btnText = document.getElementById("myBtn");

        if (dots.style.display === "none") {
            dots.style.display = "inline";
            btnText.innerHTML = "Read more";
            moreText.style.display = "none";
        } else {
            dots.style.display = "none";
            btnText.innerHTML = "Read less";
            moreText.style.display = "inline";
        }
    }

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
            setJobToApply(null);
        }
        else {
            message.error('Looks like you already applied for this job!');
        }
        $(".apply-form-" + formIndex).toggle();
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
            if (search.length > 0)
                setjobsToDisplay(search);
        } else {
            setjobsToDisplay(jobResults);
        }
    }


    const applicationDetailsForm = (index) => {
        return (
            <React.Fragment>
                <Form
                    name="applyJob"
                    className={"apply-form-" + index + " applyForm"}
                    style={{ display: 'none' }}
                    initialValues={{
                    }}
                    onFinish={onFinishApplyForm}
                    size="small"
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
                        <Button type="secondary" style={{ marginRight: '1em' }} onClick={() => { $(".apply-form-" + index).toggle(); }} className="apply-job-btn">
                            Close
                        </Button>
                        <Button type="primary" htmlType="submit" className="apply-job-btn">
                            Done
                        </Button>
                    </Form.Item>
                </Form>
            </React.Fragment>);
    }

    if (jobsToDisplay.length <= 0) {
        return <h2 style={{ textAlign: 'center', marginTop: '20%' }}>Getting what you asked, hold on</h2>
    }
    else {
        return (
            <div className="jobs-list-container">
                <Search id="search-box" placeholder="Search by job title, description, recruiter" onChange={handleOnChange} />
                <React.Fragment>
                    <List>
                        {jobsToDisplay.map((job, index) => {
                            return <React.Fragment>
                                <List.Item
                                    key={job.jobId}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={job.companyLogoURL} />}
                                        title={job.title}
                                        description={`${job.company}, ${job.location}`}
                                    />
                                    <p style={{ fontWeight: 'bold' }}>Job Description</p>
                                    {job.desc}
                                    {/* <p>{job.desc.substring(0, 50)}<span id="dots">...</span><span id="more">{job.desc.substring(50, job.desc.length - 1)}</span></p> */}
                                    {/* <Button>Read more</Button> */}
                                    <Divider>
                                        <p>Posted by {job.fullName} on {(new Date(job.createdAt)).toDateString()}</p>
                                        <Button style={{ marginBottom: '10px' }} type="primary" htmlType="submit" onClick={() => { $(".apply-form-" + index).toggle(); setFormIndex(index); setJobToApply(jobsToDisplay[index]) }} className="apply-job-btn">
                                            Apply for this job
                                        </Button>
                                    </Divider>
                                    {applicationDetailsForm(index)}
                                </List.Item>
                                <Space />
                            </React.Fragment>
                        })}
                    </List>
                </React.Fragment>
            </div>
        );
    }

}

export default CandidateDashboard;
