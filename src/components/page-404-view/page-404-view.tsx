import React, {Component} from "react";
import {Link} from "react-router-dom";

export default class Page404View extends Component {
    render() {
        return (
            <div className="margin-after-header">
                <h3 className="d-flex justify-content-center">Ошибка 404: Страница не найдена.</h3>
                <h4 className="d-flex justify-content-center"><Link to="/">Вернуться на главную.</Link></h4>
            </div>
        );
    }
}
