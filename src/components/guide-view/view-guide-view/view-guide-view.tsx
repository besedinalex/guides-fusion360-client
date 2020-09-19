import React, {Component} from "react";
import {RouteComponentProps, Redirect, Link} from "react-router-dom";
import HeaderComponent from "../../header-component/header-component";
import PartGuide from "../../../interfaces/part-guide";
import {getGuideFile} from "../../../api/guides";
import FooterComponent from "../../footer-component/footer-component";
import {base64ToBlob} from "../../../services/base64";
import Glyphicon from '@strongdm/glyphicon';
import $ from 'jquery';
import {userAccess} from "../../../api/user-data";
import {getGuideOwnerInfo, getPartGuidesSorted} from "../../../services/guides-view-data";
import './view-guide-view.sass';

interface State {
    redirect: boolean;
    guideId: number;
    guides: Array<PartGuide>;
    currentGuideName: string;
    currentGuideContent: string;
    currentGuideType: string;
    currentGuideFile: string;
    preview: string;
    guideOwner: string;
}

export default class ViewGuideView extends Component<RouteComponentProps, State> {

    private _isMounted: boolean;

    state = {
        redirect: false,
        guideId: null,
        guides: [],
        currentGuideName: '',
        currentGuideContent: '',
        currentGuideType: '',
        currentGuideFile: '',
        preview: '',
        guideOwner: 'Test'
    };

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
        const guides = await getPartGuidesSorted(guideId);
        const guideOwner = await getGuideOwnerInfo(guideId);
        this._isMounted && this.setState({guides, guideOwner});
    }

    componentWillUnmount() {
        this._isMounted = false;
        $("#modal").modal("hide");
    }

    fillModalWindow(part: PartGuide) {
        this.setState({
            currentGuideName: part.name,
            currentGuideContent: part.content,
            currentGuideType: 'loading',
            currentGuideFile: ''
        });

        let type = '';
        if (/.+\.zip/gi.test(part.content)) { // ZIP file
            type = 'archive';
        } else if (/.+\.pdf/gi.test(part.content)) { // PDF file
            type = 'pdf';
        } else if (/https?:\/\/(www\.)?(\w+\.)+(\w+)(\/(\w+|\?*|=*|\.)+)*/gi.test(part.content)) { // URL link
            this.setState({currentGuideType: 'video'});
            return;
        } else {
            this.setState({currentGuideType: 'unknown'});
            return;
        }

        getGuideFile(this.state.guideId, part.content)
            .then(data => this._isMounted && this.setState({currentGuideFile: data, currentGuideType: type}))
            .catch(message => {
                alert(message);
                this._isMounted && this.setState({currentGuideType: 'unknown'});
            });
    }

    modalWindowContent = () => {
        switch (this.state.currentGuideType) {
            case 'video':
                return (
                    <div className="modal-body" id="modal-body">
                        <div className="embed-responsive embed-responsive-16by9">
                            <iframe className="embed-responsive-item" src={this.state.currentGuideContent}
                                    title="video" />
                        </div>
                    </div>
                );
            case 'archive':
                return (
                    <div className="modal-body" id="modal-body">
                        <p>Для данной сборки вам понадобятся уже заготовленные нами модели.</p>
                        <a href={this.state.currentGuideFile} download={this.state.currentGuideContent}>
                            Кликните, чтобы скачать готовые модели.
                        </a>
                        <br />
                    </div>
                );
            case 'pdf':
                const data = URL.createObjectURL(base64ToBlob(this.state.currentGuideFile)) + '#view=fitH&toolbar=0';
                return (
                    <div className="modal-body guide-modal" id="modal-body">
                        <iframe src={data} title='PDF guide' className="w-100 h-100" />
                    </div>
                );
            case 'loading':
                return (
                    <div className="modal-body" id="modal-body">
                        <h3 className="text-center mt-3">Загрузка...</h3>
                    </div>
                );
            default:
                return (
                    <div className="modal-body" id="modal-body">
                        <h3 className="text-center mt-3">Не удалось отобразить гайд.</h3>
                    </div>
                );
        }
    }

    pdfLink = () => {
        if (this.state.currentGuideType === 'pdf') {
            return (
                <Link to={`/document/${this.state.guideId}?filename=${this.state.currentGuideContent}`} className="mx-2"
                      title='Открыть файл в новой вкладке'>
                    <Glyphicon glyph="new-window" />
                </Link>
            );
        }
    }

    ownerInfo = () => {
        if (userAccess === 'editor' || userAccess === 'admin') {
            return (
                <h6 className="text-center">
                    Автор гайда: {this.state.guideOwner}
                </h6>
            );
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }
        return (
            <div>
                <HeaderComponent />

                <div className="container margin-after-header margin-before-footer py-4">
                    <img src={this.state.preview}
                         className="mx-auto w-50 h-50 d-block my-4 img-fluid border rounded border"
                         alt="Preview of the model." />
                    {this.ownerInfo()}
                    <ul className="nav justify-content-center">
                        {this.state.guides.map((guide: PartGuide, i) => {
                            return (
                                <li className="px-2 py-2" key={i}>
                                    <button className="btn btn-success" data-toggle="modal" data-target="#modal"
                                            onClick={() => this.fillModalWindow(guide)}>
                                        {guide.name}
                                    </button>
                                </li>
                            );
                        })}
                        <li className="px-2 py-2">
                            <Link to={`/model/${this.state.guideId}`} className="btn btn-info">Посмотреть в 3D</Link>
                        </li>
                    </ul>
                </div>

                <div className="modal fade" id="modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div role="document"
                         className={this.state.currentGuideType === 'pdf' ? 'modal-dialog modal-xl h-90' : 'modal-dialog modal-xl'}>
                        <div className="modal-content h-100">
                            <div className="modal-header">
                                <div className="modal-title" id="modal-title">
                                    <h5 className="d-inline">{this.state.currentGuideName}</h5>
                                    {this.pdfLink()}
                                </div>
                            </div>
                            {this.modalWindowContent()}
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Закрыть</button>
                            </div>
                        </div>
                    </div>
                </div>

                <FooterComponent />
            </div>
        );
    }
}
