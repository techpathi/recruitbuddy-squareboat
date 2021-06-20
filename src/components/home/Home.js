import React, { Component } from 'react';
import Navbar from '../navbar/NavBar';
import Login from '../login/Login';
import SignUp from '../signup/Signup';
import CandidateDashboard from '../candidateDashboard/CandidateDashboard';
import RecruiterDashboard from '../recruiterDashboard/RecruiterDashboard';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class Home extends Component {

    render() {
        return (
            <React.Fragment>
                <Router>
                    <Navbar />
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={SignUp} />
                        <Route path="/candidateDashboard" component={CandidateDashboard} />
                        <Route path="/recruiterDashboard" component={RecruiterDashboard} />
                        <Route path="/" component={Login} />
                    </Switch>
                </Router>
            </React.Fragment>
        );
    }
}

export default Home;