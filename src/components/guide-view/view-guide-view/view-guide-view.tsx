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

    // fillModalWindow(part: PartGuide) {
    //     this.setState({currentGuideName: part.name});
    //     let content = [];
    //     const parsedContent = part.content.split('^');
    //     for (const line of parsedContent) {
    //         if (/[0-9]+\.(?:jpg|png|JPG|PNG)$/gi.test(line)) { // Image
    //             const link = `${serverURL}/images/guide/${this.state.guideId}/${line}`;
    //             content.push({data: link, code: 'img'});
    //         } else if (/https?:\/\/(www\.)?(\w+\.)+(\w+)(\/(\w+|\?*|=*|\.)+)*/gi.test(line)) { // YouTube Video
    //             content.push({data: line, code: 'video'});
    //         } else if (/parts\.zip/gi.test(line)) { // .zip file
    //             const link = `${serverURL}/models/${this.state.guideId}/parts.zip`;
    //             content.push({data: link, code: 'parts'});
    //         } else if (line.length > 0) { // Text
    //             content.push({data: line, code: 'text'});
    //         }
    //     }
    //     this.setState({currentGuideContent: content});
    // };
    //
    // getImgId(data: string): number {
    //     // @ts-ignore
    //     const filename = data.match(/[0-9]+\.(?:jpg|png|JPG|PNG)$/gi)[0];
    //     const id = filename.slice(0, filename.length - 4);
    //     return Number(id);
    // }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/page404" />
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
                                            data-target="#modal"
                                            // onClick={() => this.fillModalWindow(guide)}
                                    >
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
                    <div className="modal-dialog modal-xl h-90" role="document">
                        <div className="modal-content h-100">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modal-title">{this.state.currentGuideName} Test</h5>
                            </div>
                            <div className="modal-body guide-modal" id="modal-body">
                                <iframe src={'http://localhost:4004/images/file.pdf#view=fitH&toolbar=0'} className="w-100 h-100" />
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
