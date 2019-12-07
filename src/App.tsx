import React, {Component} from 'react';
import './App.sass';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import GuidesContainerView from "./components/home-page-view/guides-container-view/guides-container-view";
import ViewGuideView from "./components/guide-view/view-guide-view/view-guide-view";
import ModelViewerView from "./components/model-viewer-view/model-viewer-view";
import SignInAuthView from "./components/auth-view/sign-in-auth-view/sign-in-auth-view";
import Page404View from "./components/page-404-view/page-404-view";
import SignUpAuthView from "./components/auth-view/signup-auth-view/sign-up-auth-view";

export default class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={GuidesContainerView} />
                        <Route path="/guide/:id" component={ViewGuideView} />
                        <Route path="/model/:id" component={ModelViewerView} />
                        <Route path="/login" component={SignInAuthView} />
                        <Route path="/signup" component={SignUpAuthView} />
                        <Route component={Page404View} />
                    </Switch>
                </div>
            </Router>
        );
    }
}
