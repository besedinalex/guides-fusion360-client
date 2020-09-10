import React, {Component} from "react";
import Glyphicon from '@strongdm/glyphicon';
import HeaderComponent from "../../header-component/header-component";
import PartGuide from "../../../interfaces/part-guide";
import {Link, Redirect, RouteComponentProps} from "react-router-dom";
import {userAccess} from "../../../api/user-data";
import $ from "jquery";
import {getGuideOwnerInfo, getPartGuidesSorted} from "../../../services/guides-view-data";
import {
    getGuideFile, postModel, postNewPartGuide, putPartGuide, putPartGuidesSortKey, removeGuide, removePartGuide,
    updateGuideVisibility
} from "../../../api/guides";

interface State {
    redirect: boolean;
    removedRedirect: boolean;
    guideId: number;
    guides: PartGuide[];
    currentMode: string;
    currentGuideId: number;
    currentGuideName: string;
    changedGuideName: string;
    changedGuideVideoLink: string;
    changedFileName: string;
    preview: string;
    guideOwner: string;
}

export default class EditGuideView extends Component<RouteComponentProps, State> {

    private _isMounted: boolean;
    fileInput: React.RefObject<any>;

    state = {
        redirect: false,
        removedRedirect: false,
        guideId: null,
        guides: [],
        currentMode: 'guide',
        currentGuideId: 0,
        currentGuideName: '',
        changedGuideName: '',
        changedGuideVideoLink: '',
        changedFileName: '',
        preview: '',
        guideOwner: ''
    }

    async componentDidMount() {
        this._isMounted = true;
        // @ts-ignore
        const guideId = this.props.match.params.id;
        this.setState({guideId});
        try {
            const preview = await getGuideFile(guideId, 'preview.png');
            this._isMounted && this.setState({preview});
        } catch {
            this._isMounted && this.setState({redirect: true});
            return;
        }
        this.fileInput = React.createRef();
        const guides = await getPartGuidesSorted(guideId);
        const guideOwner = await getGuideOwnerInfo(guideId);
        this._isMounted && this.setState({guides, guideOwner});
    }

    componentWillUnmount() {
        this._isMounted = false;
        $("#modal").modal("hide");
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

    handlePublishGuide = () => {
        const message =
            'Вы уверены, что хотите опубликовать гайд? Гайд можно редактировать только когда он скрыт. ' +
            'Вы сможете скрыть его позже.';
        // eslint-disable-next-line no-restricted-globals
        if (confirm(message)) {
            updateGuideVisibility(this.state.guideId, false)
                .then(() => this._isMounted && this.setState({redirect: true}))
                .catch(message => alert(message));
        }
    }

    handleRemoveGuide = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Вы уверены, что хотите удалить гайд?')) {
            removeGuide(this.state.guideId)
                .then(() => this._isMounted && this.setState({removedRedirect: true}))
                .catch(message => alert(message));
        }
    }

    handleRemovePartGuide = id =>
        removePartGuide(id)
            .catch(message => alert(message))
            .finally(() => window.location.reload());


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
                    .catch(message => alert(message));
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

    ownerInfo = () => {
        if (userAccess === 'editor' || userAccess === 'admin') {
            return (
                <h6 className="text-center mb-3">
                    Автор гайда: {this.state.guideOwner}
                </h6>
            );
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }
        if (this.state.removedRedirect) {
            return <Redirect to="/hidden" />
        }

        return (
            <div>
                <HeaderComponent />

                <div className="container margin-after-header py-4 justify-content-center">
                    <img src={this.state.preview} alt="Preview of the model."
                         className="mx-auto w-50 h-50 d-block my-4 img-fluid border rounded border" />
                    {this.ownerInfo()}
                    <div className="list-group w-50 m-auto">

                        {this.state.guides.map((guide, i) => {
                            return (
                                <div className="list-group-item list-group-item-success" key={i} data-toggle="modal"
                                     data-target="#modal" onClick={() => this.fillModalWindow('guide', guide)}>
                                    <span className="float-left">
                                        {guide.name}
                                    </span>
                                    <button className="float-right btn btn-sm m-0 mx-1 p-0"
                                            onClick={() => this.handleRemovePartGuide(guide.id)}>
                                        <Glyphicon glyph="remove" />
                                    </button>
                                    <button className="float-right btn btn-sm m-0 mx-1 p-0"
                                            disabled={i === this.state.guides.length - 1}
                                            onClick={() => this.handleDownButton(i)}>
                                        <Glyphicon glyph="chevron-down" />
                                    </button>
                                    <button className="float-right btn btn-sm m-0 mx-1 p-0" disabled={i === 0}
                                            onClick={() => this.handleUpButton(i)}>
                                        <Glyphicon glyph="chevron-up" />
                                    </button>
                                </div>
                            )
                        })}

                        <button className="list-group-item list-group-item-primary" data-toggle="modal"
                                data-target="#modal" onClick={() => this.fillModalWindow('guide')}>
                            Создать гайд
                        </button>

                        <button className="list-group-item list-group-item-primary" data-toggle="modal"
                                data-target="#modal" onClick={() => this.fillModalWindow('model')}>
                            Загрузить модель
                        </button>

                        <Link to={`/guide/${this.state.guideId}`} style={{color: "inherit"}}
                              className="list-group-item list-group-item-info text-center text-decoration-none">
                            Просмотр гайда
                        </Link>

                        <button className="list-group-item list-group-item-warning" hidden={userAccess !== 'admin'}
                                onClick={this.handlePublishGuide}>
                            Опубликовать гайд
                        </button>

                        <button className="list-group-item list-group-item-danger" hidden={userAccess !== 'admin'}
                                onClick={this.handleRemoveGuide}>
                            Удалить гайд
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

                            <div className="modal-body py-0 px-3" id="modal-body">
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
