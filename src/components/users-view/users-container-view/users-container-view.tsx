import React, {Component} from "react";
import User from "../../../interfaces/user";
import {getAllUsers} from "../../../api/user-data";
import HeaderComponent from "../../header-component/header-component";
import FooterComponent from "../../footer-component/footer-component";
import {Redirect, RouteComponentProps} from "react-router-dom";
import UserRowComponent from "../user-row-component/user-row-component";

interface State {
    users: User[];
    redirect: boolean;
}

export default class UsersContainerView extends Component<RouteComponentProps, State> {

    private _isMounted: boolean;

    state = {
        users: [],
        redirect: false
    }

    async componentDidMount() {
        this._isMounted = true;
        try {
            const users = await getAllUsers();
            users.sort((a, b) => a.access < b.access ? -1 : a.access > b.access ? 1 : 0);
            this._isMounted && this.setState({users});
        } catch (message) {
            alert(message);
            this._isMounted && this.setState({redirect: true});
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }

        return (
            <div>
                <HeaderComponent />

                <div className="album margin-after-header margin-before-footer py-5">
                    <div className="container">

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Имя Фамилия</th>
                                    <th scope="col">Почта</th>
                                    <th scope="col">Уровень доступа</th>
                                    <th scope="col" />
                                    <th scope="col" />
                                    <th scope="col" />
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.users.map((user, i) => {
                                    return <UserRowComponent email={user.email} firstName={user.firstName}
                                                             lastName={user.lastName} access={user.access} key={i} />
                                })}
                            </tbody>
                        </table>

                    </div>
                </div>

                <FooterComponent />
            </div>
        );
    }
}