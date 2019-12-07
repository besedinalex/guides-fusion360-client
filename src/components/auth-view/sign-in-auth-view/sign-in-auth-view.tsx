import React, {Component} from "react";
import {Link} from "react-router-dom";
import '../auth-view.sass';

interface State {
    email: string;
    password: string;
    redirect: boolean;
}

export default class SignInAuthView extends Component<{}, State> {

    state = {
        email: '',
        password: '',
        redirect: false
    };

    handleEmailChange = (e) => this.setState({email: e.target.value});

    handlePasswordChange = (e) => this.setState({password: e.target.value});

    signIn(event) {
        // TODO: Connect to auth service.
    }

    render() {
        return (
            <div>
                <form className="form-auth">
                    <Link to="/">
                        <img className="mb-4" src={require('../../../assets/logo250.jpg')} width="128" height="128" alt="Logo" />
                    </Link>
                    <h1 className="h3 mb-3 font-weight-normal">Вход</h1>
                    <input onChange={this.handleEmailChange} type="text" className="form-control form-control-top" placeholder="Электронная почта" autoFocus />
                    <input onChange={this.handlePasswordChange} type="password" className="form-control form-control-bottom" placeholder="Пароль" />
                    <Link to="/signup" className="link">Нет аккаунта? Зарегистрируйся!</Link>
                    <button onClick={this.signIn} className="btn btn-lg btn-primary btn-block" type="submit">Войти</button>
                    <p className="mt-2 mb-3 text-muted">© 2019-{new Date().getFullYear()}</p>
                </form>
            </div>
        );
    }
}
