import React, {Component} from "react";
import {RouteComponentProps, Redirect, Link} from "react-router-dom";
import HeaderComponent from "../../header-component/header-component";
import PartGuide from "../../../interfaces/part-guide";
import {getGuidePreview, getPartGuides} from "../../../api/guides";
import {serverURL} from "../../../api/server-address";
import './view-guide-view.sass';

interface State {
    redirect: boolean;
    guideId: number;
    guides: Array<PartGuide>;
    currentGuideName: string;
    currentGuideContent: string;
    currentGuideType: string;
    preview: string;
}

export default class ViewGuideView extends Component<RouteComponentProps, State> {

    state = {
        redirect: false,
        guideId: 0,
        guides: [],
        currentGuideName: '',
        currentGuideContent: '',
        currentGuideType: '',
        preview: ''
    };

    componentDidMount() {
        // @ts-ignore
        const guideId = this.props.match.params.id;
        this.setState({guideId: guideId});
        getGuidePreview(guideId)
            .then(data => this.setState({preview: data}))
            .catch(() => this.setState({redirect: true}));
        getPartGuides(guideId)
            .then(guides =>
                this.setState({guides: guides.sort(((a, b) => a.sortKey - b.sortKey))}))
            .catch(message => alert(message));
    }

    fillModalWindow(part: PartGuide) {
        this.setState({currentGuideName: part.name, currentGuideContent: part.content});
        let type = '';
        if (/https?:\/\/(www\.)?(\w+\.)+(\w+)(\/(\w+|\?*|=*|\.)+)*/gi.test(part.content)) { // YouTube Video
            type = 'video';
        } else if (/.+\.zip/gi.test(part.content)) { // Archive
            type = 'archive';
        } else {
            type = 'pdf';
        }
        this.setState({currentGuideType: type});
    }

    modalWindowContent = () => {
        const guideStorage = `${serverURL}/storage/${this.state.guideId}`;
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
                        <a href={`${guideStorage}/${this.state.currentGuideContent}`}
                           download={this.state.currentGuideContent}>
                            Кликните, чтобы скачать готовые модели.
                        </a>
                        <br />
                    </div>
                );
            default: // PDF
                return (
                    <div className="modal-body guide-modal" id="modal-body">
                        <iframe src={`${guideStorage}/${this.state.currentGuideContent}#view=fitH&toolbar=0`}
                                className="w-100 h-100" />
                    </div>
                );
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/page404" />
        }
        return (
            <div>
                <HeaderComponent />

                <div className="container margin-after-header py-4">
                    <img src={this.state.preview}
                         className="mx-auto w-50 h-50 d-block my-4 img-fluid border rounded border"
                         alt="Preview of the model." />
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
                            <Link to={`/model/${this.state.guideId}`} className="btn btn-warning text-white">Посмотреть
                                в 3D</Link>
                        </li>
                    </ul>
                </div>

                <div className="modal fade" id="modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div role="document"
                         className={this.state.currentGuideType === 'pdf' ? 'modal-dialog modal-xl h-90' : 'modal-dialog modal-xl'}>
                        <div className="modal-content h-100">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modal-title">{this.state.currentGuideName}</h5>
                            </div>
                            {this.modalWindowContent()} {/*Modal body*/}
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Закрыть</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
