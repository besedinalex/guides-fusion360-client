import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import '../auth-view.sass';
import {postNewUser} from "../../../services/user-data";

interface State {
    email: string;
    firstName: string;
    lastName: string;
    group: string;
    password: string;
    redirect: boolean;
}

export default class SignUpAuthView extends Component<{}, State> {

    state = {
        email: '',
        firstName: '',
        lastName: '',
        group: '',
        password: '',
        redirect: false
    };

    handleEmailChange = (e) => this.setState({email: e.target.value});

    handleFirstNameChange = (e) => this.setState({firstName: e.target.value});

    handleLastNameChange = (e) => this.setState({lastName: e.target.value});

    handleGroupChange = (e) => this.setState({group: e.target.value});

    handlePasswordChange = (e) => this.setState({password: e.target.value});

    signUp = (event) => {
        event.preventDefault();
        postNewUser(this.state.firstName, this.state.lastName, this.state.email, this.state.password, this.state.group)
            .then(() => this.setState({redirect: true}))
            .catch(message => alert(message));
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />;
        }
        return (
            <div>
                <form className="form-auth">
                    <Link to="/">
                        <img className="mb-4" src={require('../../../assets/logo250.jpg')} width="128" height="128"
                             alt="Logo" />
                    </Link>
                    <h1 className="h3 mb-3 font-weight-normal">Регистрация</h1>
                    <input onChange={this.handleEmailChange} type="text" className="form-control form-control-top"
                           placeholder="Электронная почта" autoFocus />
                    <input onChange={this.handleFirstNameChange} type="text" className="form-control form-control-mid"
                           placeholder="Имя" />
                    <input onChange={this.handleLastNameChange} type="text" className="form-control form-control-mid"
                           placeholder="Фамилия" />
                    <input onChange={this.handleGroupChange} type="text" className="form-control form-control-mid"
                           placeholder="Группа" />
                    <input onChange={this.handlePasswordChange} type="password"
                           className="form-control form-control-bottom" placeholder="Пароль" />
                    <Link to="/login" className="link">Уже есть аккаунт? Войди!</Link>
                    <button onClick={this.signUp} className="btn btn-lg btn-primary btn-block"
                            type="submit">Зарегистрироваться
                    </button>
                    <p className="mt-2 mb-3 text-muted">© 2019-{new Date().getFullYear()}</p>
                </form>
            </div>
        );
    }
}
