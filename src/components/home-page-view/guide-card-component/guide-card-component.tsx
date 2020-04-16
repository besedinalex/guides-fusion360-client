import React, {Component} from "react";
import {Link} from "react-router-dom";
import Guide from "../../../interfaces/guide";
import {serverURL} from "../../../services/server-address";
import './guide-card-component.sass'
import {isAuthenticated} from "../../../services/user-data";

export default class GuideCardComponent extends Component<Guide> {
    render() {
        return (
            <div className="col-md-4 d-flex align-items-stretch">
                <div className="card mb-4 box-shadow">
                    <img className="card-img-top border-bottom"
                         src={`${serverURL}/storage/${this.props.id}/preview.png`} alt="Preview of the model." />
                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{this.props.name}</h5>
                        <p className="card-text">{this.props.description}</p>
                        <div className="mt-auto">
                            <Link to={`/guide/${this.props.id}`} className="btn btn-success guide-start-btn">
                                Приступить
                            </Link>
                            <Link to={`/edit/${this.props.id}`} className="btn btn-warning text-white" hidden={!isAuthenticated}>
                                Редактировать
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
