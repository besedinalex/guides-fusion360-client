import React, {Component} from 'react';
import './App.sass';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import GuidesContainerView from "./components/home-page-view/guides-container-view/guides-container-view";
import ViewGuideView from "./components/guide-view/view-guide-view/view-guide-view";

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={GuidesContainerView} />
                        <Route path="/guide/:id" component={ViewGuideView} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
