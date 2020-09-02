import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import {restorePassword} from "../../../api/user-data";
import '../auth-view.sass';

interface State {
    restoreCode: string;
    password: string;
    redirect: boolean;
}

export default class ForgotPasswordView extends Component<{}, State> {

    state = {
        restoreCode: '',
        password: '',
        redirect: false
    };

    handleRestoreCodeChange = (e) => this.setState({restoreCode: e.target.value});

    handlePasswordChange = (e) => this.setState({password: e.target.value});

    signIn = (event) => {
        event.preventDefault();
        restorePassword(this.state.restoreCode, this.state.password)
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
                    <h1 className="h3 mb-3 font-weight-normal">Восстановление пароля</h1>
                    <input onChange={this.handleRestoreCodeChange} type="text" className="form-control form-control-top"
                           placeholder="Код восстановления" autoFocus />
                    <input autoComplete="new-password" onChange={this.handlePasswordChange} type="password"
                           className="form-control form-control-bottom" placeholder="Пароль" />
                    <Link to="/login" className="link">Вспомнили пароль?</Link>
                    <button onClick={this.signIn} className="btn btn-lg btn-primary btn-block" type="submit">Войти
                    </button>
                    <p className="mt-2 mb-3 text-muted">© 2019-{new Date().getFullYear()}</p>
                </form>
            </div>
        );
    }
}