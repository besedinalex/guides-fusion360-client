import React from "react";
import {Redirect, Route} from "react-router";
import {isAuthenticated} from "../../../api/user-data";

export default function PrivateRouteComponent({component: Component, ...rest}) {
    return (
        <Route {...rest}
               render={props => isAuthenticated ? (<Component {...rest} {...props} />) : (<Redirect to="/login" />)}
        />
    );
}
