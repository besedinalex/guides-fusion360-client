import React, {Component} from "react";
import {Link} from "react-router-dom";
import Guide from "../../../interfaces/guide";
import {serverURL} from "../../../services/server-address";
import './guide-card.sass'

export default class GuideCard extends Component<Guide> {
    render() {
        return (
            <div className="col-md-4 d-flex align-items-stretch">
                <div className="card mb-4 box-shadow">
                    <img className="card-img-top border-bottom" src={`${serverURL}/images/home/${this.props.imageName}`} />
                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{this.props.name}</h5>
                        <p className="card-text">{this.props.description}</p>
                        <Link to="/" className="btn btn-success mt-auto guide-start">Приступить</Link>
                    </div>
                </div>
            </div>
        );
    }
}
