import React, {Component} from "react";
import {Link} from "react-router-dom";
import Guide from "../../../interfaces/guide";
import './guide-card-component.sass'
import {getGuideFile} from "../../../api/guides";

interface Hidden {
    hidden: boolean;
}

interface State {
    preview: string;
}

export default class GuideCardComponent extends Component<Guide & Hidden, State> {

    state = {
        preview: ''
    }

    componentDidMount() {
        getGuideFile(this.props.id, 'preview.png').then(data => this.setState({preview: data}));
    }

    render() {
        return (
            <div className="col-md-4 d-flex align-items-stretch">
                <div className="card mb-4 box-shadow">
                    <img className="card-img-top border-bottom"
                         src={this.state.preview} alt="Preview of the model." />
                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{this.props.name}</h5>
                        <p className="card-text">{this.props.description}</p>
                        <div className="mt-auto">
                            <Link to={`/guide/${this.props.id}`} className="btn btn-success guide-start-btn">
                                Приступить
                            </Link>
                            <Link to={`/edit/${this.props.id}`} className="btn btn-warning text-white"
                                  hidden={!this.props.hidden}>
                                Редактировать
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
