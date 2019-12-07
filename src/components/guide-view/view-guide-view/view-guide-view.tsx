import React, {Component} from "react";
import {RouteComponentProps, Redirect, Link} from "react-router-dom";
import HeaderComponent from "../../header-component/header-component";
import PartGuide from "../../../interfaces/part-guide";
import {getGuideImageName, getPartGuides} from "../../../services/guides";
import {serverURL} from "../../../services/server-address";
import './view-guide-view.sass';

interface GuideContent {
    data: string;
    code: string;
}

interface State {
    redirect: boolean;
    guideId: number;
    guideImageName: string;
    guides: Array<PartGuide>;
    currentGuideName: string;
    currentGuideContent: Array<GuideContent>;
}

export default class ViewGuideView extends Component<RouteComponentProps, State> {

    state = {
        redirect: false,
        guideId: 0,
        guideImageName: '',
        guides: [],
        currentGuideName: '',
        currentGuideContent: []
    };

    componentDidMount() {
        // @ts-ignore
        const guideId = this.props.match.params.id;
        this.setState({guideId: guideId});
        getPartGuides(guideId).then(guides => {
            if (guides.length === 0) {
                this.setState({redirect: true});
            } else {
                this.setState({guides: guides});
                getGuideImageName(guideId).then(imgName => this.setState({guideImageName: imgName}));
            }
        });
    }

    fillModalWindow(part: PartGuide) {
        this.setState({currentGuideName: part.name});
        let content = [];
        const parsedContent = part.content.split('^');
        for (const line of parsedContent) {
            if (/[0-9]+\.(?:jpg|png|JPG|PNG)$/gi.test(line)) { // Image
                const link = `${serverURL}/images/guide/${this.state.guideId}/${line}`;
                content.push({data: link, code: 'img'});
            } else if (/https?:\/\/(www\.)?(\w+\.)+(\w+)(\/(\w+|\?*|=*|\.)+)*/gi.test(line)) { // YouTube Video
                content.push({data: line, code: 'video'});
            } else if (/parts\.zip/gi.test(line)) { // .zip file
                const link = `${serverURL}/models/${this.state.guideId}/parts.zip`;
                content.push({data: link, code: 'parts'});
            } else if (line.length > 0) { // Text
                content.push({data: line, code: 'text'});
            }
        }
        this.setState({currentGuideContent: content});
    };

    getImgId(data: string): number {
        // @ts-ignore
        const filename = data.match(/[0-9]+\.(?:jpg|png|JPG|PNG)$/gi)[0];
        const id = filename.slice(0, filename.length - 4);
        return Number(id);
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/'} />
        }
        return (
            <div>
                <HeaderComponent />

                <div className="container margin-after-header py-4">
                    <img src={`${serverURL}/images/home/${this.state.guideImageName}`}
                         className="mx-auto d-block my-4 img-fluid border rounded border" alt="Preview of the model." />
                    <ul className="nav justify-content-center">
                        {this.state.guides.map((guide: PartGuide, i) => {
                            return (
                                <li className="px-2 py-2" key={i}>
                                    <button className="btn btn-success" data-toggle="modal"
                                            data-target="#modal" onClick={() => this.fillModalWindow(guide)}>
                                        {guide.name}
                                    </button>
                                </li>
                            );
                        })}
                        <li className="px-2 py-2">
                            <Link to={`/model/${this.state.guideId}`} className="btn btn-warning text-white">Посмотреть в 3D</Link>
                        </li>
                    </ul>
                </div>

                <div className="modal fade" id="modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modal-title">{this.state.currentGuideName}</h5>
                            </div>
                            <div className="modal-body" id="modal-body">
                                {this.state.currentGuideContent.map((part: GuideContent, i) => {
                                    switch (part.code) {
                                        case 'img':
                                            return (
                                                <div className="body align-items-center flex-column d-flex" key={i}>
                                                    <img className="img" src={part.data}
                                                         alt="Visual presentation of above text." />
                                                    <p>Рис. {this.getImgId(part.data)}</p>
                                                </div>
                                            );
                                        case 'video':
                                            return (
                                                <div className="body align-items-center flex-column d-flex" key={i}>
                                                    <div className="embed-responsive embed-responsive-16by9">
                                                        <iframe className="embed-responsive-item" src={part.data}
                                                                title="video" />
                                                    </div>
                                                </div>
                                            );
                                        case 'parts':
                                            return (
                                                <div className="body align-items-center flex-column d-flex" key={i}>
                                                    <a href={part.data} download="Готовые детали.zip">Готовые детали</a>
                                                    <br />
                                                </div>
                                            );
                                        case 'text':
                                            return (
                                                <div className="body align-items-center flex-column d-flex" key={i}>
                                                    <p className="text">{part.data}</p>
                                                </div>
                                            );
                                        default: return null;
                                    }
                                })}
                            </div>
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
