import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import GuidesContainer from "./components/home-page/guides-container/guides-container";

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/" component={GuidesContainer}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
