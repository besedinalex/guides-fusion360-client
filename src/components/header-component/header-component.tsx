import React, {Component} from "react";
import {Link} from "react-router-dom";
import './header-component.sass';
import {signOut, isAuthenticated, userAccess} from "../../api/user-data";

export default class HeaderComponent extends Component {

    whatIsNextMessage = e => {
        e.preventDefault();
        alert('Обратитесь к Антону Витальевичу, чтобы получить право на редактирование гайдов.');
    }

    render() {
        const isEditor = userAccess === 'editor' || userAccess === 'admin';
        return (
            <header className="navbar navbar-expand-lg py-2 navbar-dark fixed-top">
                <Link to="/" className="navbar-brand">FUSION360GUIDE</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li hidden={!isAuthenticated || isEditor} className="nav-item">
                            <Link to="" onClick={this.whatIsNextMessage} className="nav-link">
                                Что дальше?
                            </Link>
                        </li>
                        <li hidden={!isEditor} className="nav-item">
                            <Link to="/create" className="nav-link">Создать</Link>
                        </li>
                        <li hidden={!isEditor} className="nav-item">
                            <Link to="/hidden" className="nav-link">Редактировать</Link>
                        </li>
                        <li hidden={userAccess !== 'admin'} className="nav-item">
                            <Link to="/users" className="nav-link">Пользователи</Link>
                        </li>
                    </ul>
                    <Link to="/login" hidden={isAuthenticated} className="navbar-right">
                        <button className="btn btn-light">Войти</button>
                    </Link>
                    <button onClick={signOut} hidden={!isAuthenticated} className="btn btn-danger">
                        Выйти
                    </button>
                </div>
            </header>

        );
    }
}
