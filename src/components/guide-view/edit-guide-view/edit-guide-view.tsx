import React, {Component} from "react";
import Glyphicon from '@strongdm/glyphicon';
import HeaderComponent from "../../header-component/header-component";
import {
    getGuidePreview,
    getPartGuides,
    postModel,
    postNewPartGuide,
    putPartGuide,
    putPartGuidesSortKey
} from "../../../api/guides";
import PartGuide from "../../../interfaces/part-guide";
import {Redirect, RouteComponentProps} from "react-router-dom";

interface State {
    redirect: boolean,
    guideId: number,
    guides: Array<PartGuide>;
    currentMode: string;
    currentGuideId: number;
    currentGuideName: string;
    changedGuideName: string;
    changedGuideVideoLink: string;
    changedFileName: string;
    preview: string;
}

export default class EditGuideView extends Component<RouteComponentProps, State> {

    fileInput: React.RefObject<any>;
    state = {
        redirect: false,
        guideId: 0,
        guides: [],
        currentMode: 'guide',
        currentGuideId: 0,
        currentGuideName: '',
        changedGuideName: '',
        changedGuideVideoLink: '',
        changedFileName: '',
        preview: ''
    }

    componentDidMount() {
        // @ts-ignore
        const guideId = this.props.match.params.id;
        this.setState({guideId: guideId});
        getGuidePreview(guideId)
            .then(data => this.setState({preview: data}))
            .catch(() => this.setState({redirect: true}));
        getPartGuides(guideId)
            .then(guides => this.setState({guides: guides.sort((a, b) => a.sortKey - b.sortKey)}))
            .catch(message => alert(message));
        this.fileInput = React.createRef();
    }

    handleNameChange = event => this.setState({changedGuideName: event.target.value});

    handleVideoChange = event => this.setState({changedGuideVideoLink: event.target.value});

    handleFileChange = () => this.setState({changedFileName: this.fileInput.current.files[0].name});

    handleUpButton = index => {
        const guide1 = this.state.guides[index];
        const guide2 = this.state.guides[index - 1];
        this.handleGuidesSwitch(guide1.id, guide2.id);
    }

    handleDownButton = index => {
        const guide1 = this.state.guides[index];
        const guide2 = this.state.guides[index + 1];
        this.handleGuidesSwitch(guide1.id, guide2.id);
    }

    handleGuidesSwitch = (id1, id2) => {
        putPartGuidesSortKey(id1, id2)
            .catch(message => alert(message))
            .finally(() => window.location.reload());
    }

    handleSubmit = () => {
        // Poor validation
        if (this.state.currentMode === 'guide') {
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
                    } else if (fileType === 'application/zip' || fileType === 'application/x-zip-compressed') {
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
            if (this.state.currentGuideId === 0) {
                postNewPartGuide(this.state.guideId, this.state.changedGuideName, content, this.state.guides.length)
                    .catch(message => alert(message))
                    .finally(() => window.location.reload());
            } else {
                putPartGuide(this.state.currentGuideId, this.state.changedGuideName, content)
                    .catch(message => alert(message))
                    .finally(() => window.location.reload());
            }
        } else { // model
            if (this.fileInput.current.files.length > 0) { // File chosen
                alert('Загрузка модели может занять некоторое время. ' +
                    'Проверяйте результат загрузки путем открытия модели на странице гайда.' +
                    '\nНажмите ОК, чтобы продолжить.');
                postModel(this.state.guideId, this.fileInput.current.files[0])
                    .catch(message => alert(message))
                    .finally(() => window.location.reload());
            } else {
                alert('Необходимо выбрать STP файл для загрузки');
            }
        }
    };

    fillModalWindow = (mode, guide?) => {
        this.setState({currentMode: mode});
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
                this.setState({changedGuideVideoLink: guide.content, changedFileName: ''});
            } else {
                this.setState({changedFileName: guide.content, changedGuideVideoLink: ''});
            }
            this.setState({
                currentGuideId: guide.id,
                currentGuideName: guide.name,
                changedGuideName: guide.name
            });
        }
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to="/page404" />
        }

        return (
            <div>
                <HeaderComponent />

                <div className="container margin-after-header py-4 justify-content-center">
                    <img src={this.state.preview} alt="Preview of the model."
                         className="mx-auto w-50 h-50 d-block my-4 img-fluid border rounded border" />

                    <div className="list-group w-50 m-auto">

                        {this.state.guides.map((guide, i) => {
                            return (
                                <div className="list-group-item list-group-item-success" key={i} data-toggle="modal"
                                     data-target="#modal" onClick={() => this.fillModalWindow('guide', guide)}>
                                    <span className="float-left">
                                        {guide.name}
                                    </span>
                                    <button className="float-right badge badge-white"
                                            disabled={i === this.state.guides.length - 1}
                                            onClick={() => this.handleDownButton(i)}>
                                        <Glyphicon glyph="chevron-down" />
                                    </button>
                                    <button className="float-right badge badge-white" disabled={i === 0}
                                            onClick={() => this.handleUpButton(i)}>
                                        <Glyphicon glyph="chevron-up" />
                                    </button>
                                </div>
                            )
                        })}

                        <button className="list-group-item list-group-item-danger" data-toggle="modal"
                                data-target="#modal" onClick={() => this.fillModalWindow('guide')}>
                            Создать гайд
                        </button>

                        <button className="list-group-item list-group-item-warning" data-toggle="modal"
                                data-target="#modal" onClick={() => this.fillModalWindow('model')}>
                            Загрузить модель
                        </button>
                    </div>
                </div>

                <div className="modal fade" id="modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modal-title">{this.state.currentGuideName}</h5>
                                <button className="btn-sm btn btn-danger" data-dismiss="modal">X</button>
                            </div>
                            <div className="modal-body guide-modal px-3" id="modal-body">

                                <div className="input-group my-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Название</span>
                                    </div>
                                    <input type="text" className="form-control" onChange={this.handleNameChange}
                                           disabled={this.state.currentMode === 'model'}
                                           placeholder={this.state.changedGuideName} />
                                </div>

                                <div className="input-group my-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Ссылка на видео</span>
                                    </div>
                                    <input type="text" className="form-control" onChange={this.handleVideoChange}
                                           disabled={this.state.changedFileName !== '' || this.state.currentMode === 'model'}
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
