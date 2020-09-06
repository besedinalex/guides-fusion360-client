import React, {Component} from "react";
import User from "../../../interfaces/user";
import {getAllUsers} from "../../../api/user-data";
import HeaderComponent from "../../header-component/header-component";
import FooterComponent from "../../footer-component/footer-component";
import {Redirect} from "react-router-dom";
import UserRowComponent from "../user-row-component/user-row-component";

interface State {
    users: User[];
    redirect: boolean;
}

export default class UsersContainerView extends Component<any, State> {

    state = {
        users: [],
        redirect: false
    }

    componentDidMount() {
        getAllUsers()
            .then(users => {
                users.sort((a, b) => a.access < b.access ? -1 : a.access > b.access ? 1 : 0);
                this.setState({users});
            })
            .catch(message => {
                alert(message);
                this.setState({redirect: true});
            });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }
        console.log(this.state.users);
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