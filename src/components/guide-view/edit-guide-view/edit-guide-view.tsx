import React, {Component} from "react";
import Glyphicon from '@strongdm/glyphicon';
import HeaderComponent from "../../header-component/header-component";
import {serverURL} from "../../../services/server-address";
import {getPartGuides, postNewPartGuide} from "../../../services/guides";
import PartGuide from "../../../interfaces/part-guide";
import {RouteComponentProps} from "react-router-dom";

interface State {
    redirect: boolean,
    guideId: number,
    guides: Array<PartGuide>;
    currentGuideId: number;
    currentGuideName: string;
    changedGuideName: string;
    changedGuideVideoLink: string;
    changedFileName: string;
}

export default class EditGuideView extends Component<RouteComponentProps, State> {

    fileInput: React.RefObject<any>;
    state = {
        redirect: false,
        guideId: 0,
        guides: [],
        currentGuideId: 0,
        currentGuideName: '',
        changedGuideName: '',
        changedGuideVideoLink: '',
        changedFileName: ''
    }

    componentDidMount() {
        // @ts-ignore
        const guideId = this.props.match.params.id;
        this.setState({guideId: guideId});
        getPartGuides(guideId).then(guides => {
            if (guides.length === 0) {
                this.setState({redirect: true});
            } else {
                this.setState({guides: guides});
            }
        });
        this.fileInput = React.createRef();
    }

    handleNameChange = event => this.setState({changedGuideName: event.target.value});

    handleVideoChange = event => this.setState({changedGuideVideoLink: event.target.value});

    handleFileChange = () => this.setState({changedFileName: this.fileInput.current.files[0].name})

    handleSubmit = () => {
        // Poor validation
        if (this.state.changedGuideName === '') { // Name check
            alert('Необходимо ввести название гайда.');
            return;
        } else if (this.fileInput.current.files.length === 0 && this.state.changedGuideVideoLink === '') { // Input check
            alert('Необходимо ввести ссылку на YouTube видео или загрузить PDF или ZIP файл.');
            return;
        } else {
            if (this.fileInput.current.files.length > 0) { // File chosen
                const fileType = this.fileInput.current.files[0].type;
                if (fileType === 'application/pdf') { // Format check
                } else if (fileType === 'application/zip') {
                } else {
                    alert('Необходимо загрузить PDF или ZIP файл.');
                    return;
                }
            } else { // Link entered
                if (!/https?:\/\/(www\.)?(\w+\.)+(\w+)(\/(\w+|\?*|=*|\.)+)*/gi.test(this.state.changedGuideVideoLink)) {
                    alert('Необходимо ввести корректную ссылку.');
                    return;
                }
            }
        }

        const content = this.state.changedGuideVideoLink === '' ? this.fileInput.current.files[0] : this.state.changedGuideVideoLink;
        postNewPartGuide(this.state.guideId, this.state.changedGuideName, content, this.state.guides.length)
            .then(() => window.location.reload())
            .catch((e) => console.log(e));
    };

    fillModalWindow = (guide?) => {
        if (guide === undefined) {
            this.setState({
                currentGuideId: 0,
                currentGuideName: 'Загрузка нового файла',
                changedGuideName: '',
                changedFileName: '',
                changedGuideVideoLink: ''
            });
        } else {
            if (/https?:\/\/(www\.)?(\w+\.)+(\w+)(\/(\w+|\?*|=*|\.)+)*/gi.test(guide.content)) { // YouTube Video
                this.setState({changedGuideVideoLink: guide.content});
            } else {
                this.setState({changedFileName: guide.content});
            }
            this.setState({
                currentGuideId: guide.id,
                currentGuideName: guide.name,
                changedGuideName: guide.name
            });
        }
    };

    render() {
        return (
            <div>
                <HeaderComponent />

                <div className="container margin-after-header py-4 justify-content-center">
                    <img src={`${serverURL}/storage/${this.state.guideId}/preview.png`} alt="Preview of the model."
                         className="mx-auto w-50 h-50 d-block my-4 img-fluid border rounded border" />

                    <div className="list-group w-50 m-auto">

                        {this.state.guides.map((guide, i) => {
                            return (
                                <div className="list-group-item list-group-item-success" key={i} data-toggle="modal"
                                     data-target="#modal" onClick={() => this.fillModalWindow(guide)}>
                                    <span className="float-left">
                                        {guide.name}
                                    </span>
                                    <button className="float-right badge badge-white">
                                        <Glyphicon glyph="chevron-down" />
                                    </button>
                                    <button className="float-right badge badge-white">
                                        <Glyphicon glyph="chevron-up" />
                                    </button>
                                </div>
                            )
                        })}

                        <button className="list-group-item list-group-item-danger" data-toggle="modal"
                                data-target="#modal" onClick={() => this.fillModalWindow()}>
                            Создать гайд
                        </button>
                    </div>
                </div>

                <div className="modal fade" id="modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modal-title">{this.state.currentGuideName}</h5>
                                <button className="btn-sm btn-danger" data-dismiss="modal">X</button>
                            </div>
                            <div className="modal-body guide-modal px-3" id="modal-body">

                                <div className="input-group my-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Название</span>
                                    </div>
                                    <input type="text" className="form-control" onChange={this.handleNameChange}
                                           placeholder={this.state.changedGuideName} />
                                </div>

                                <div className="input-group my-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Ссылка на видео</span>
                                    </div>
                                    <input type="text" className="form-control" onChange={this.handleVideoChange}
                                           disabled={this.state.changedFileName !== ''}
                                           placeholder={this.state.changedGuideVideoLink} />
                                </div>

                                <div className="input-group my-2">
                                    <div className="custom-file">
                                        <input ref={this.fileInput} className="custom-file-input" name="file"
                                               id="inputGroupFile04" type="file" onChange={this.handleFileChange}
                                               disabled={this.state.changedGuideVideoLink !== ''} />
                                        <label className="custom-file-label text-left" htmlFor="inputGroupFile04">
                                            {this.state.changedFileName}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-info" onClick={this.handleSubmit}>Загрузить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
