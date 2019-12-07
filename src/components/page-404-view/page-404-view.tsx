import React, {Component} from "react";
import {Link} from "react-router-dom";

export default class Page404View extends Component {
    render() {
        return (
            <div className="margin-after-header">
                <h3 className="d-flex justify-content-center">Error 404: Page is not found.</h3>
                <h4 className="d-flex justify-content-center">
                    <Link to="/">Return to landing page.</Link>
                </h4>
            </div>
        );
    }
}
