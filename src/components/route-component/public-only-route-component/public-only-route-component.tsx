import React from "react";
import {Redirect, Route} from "react-router";
import {isAuthenticated} from "../../../services/user-data";

export default function PublicOnlyRouteComponent({component: Component, ...rest}) {
    return (
        <Route {...rest}
               render={props => isAuthenticated ? (<Redirect to="/" />) : (<Component {...rest} {...props} />)}
        />
    );
}
