import React, {Component} from "react";
import {Link} from "react-router-dom";
import Guide from "../../../interfaces/guide";
import {getGuideFile, updateGuideVisibility} from "../../../api/guides";
import {userAccess} from "../../../api/user-data";
import './guide-card-component.sass'

interface Hidden {
    hidden: boolean;
}

interface State {
    preview: string;
}

export default class GuideCardComponent extends Component<Guide & Hidden, State> {

    private _isMounted: boolean;

    state = {
        preview: ''
    }

    handleHideGuide = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Вы уверены, что хотите скрыть гайд? Его можно будет опубликовать позже.')) {
            updateGuideVisibility(this.props.id, true)
                .then(() => window.location.reload())
                .catch(message => alert(message));
        }
    }

    componentDidMount() {
        this._isMounted = true;
        getGuideFile(this.props.id, 'preview.png')
            .then(data => this._isMounted && this.setState({preview: data}));
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className="col-md-4 d-flex align-items-stretch">
                <div className="card mb-4 box-shadow">
                    <img className="card-img-top border-bottom" src={this.state.preview} alt="Preview of the model." />
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
                            <button className="btn btn-warning text-white" onClick={this.handleHideGuide}
                                    hidden={userAccess !== 'admin' || this.props.hidden}>
                                Скрыть гайд
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
