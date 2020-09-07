import React, {Component} from "react";
import {Link, Redirect, RouteComponentProps} from "react-router-dom";
import {getGuideFile} from "../../../api/guides";
import base64ToBlob from "../../../services/base64ToBlob";
import './../content-viewer-view.sass';
import './pdf-viewer-view.sass';

interface State {
    redirect: boolean;
    guideId: number;
    pdfFile: string;
    windowWidth: number;
    windowHeight: number;
}

export default class PdfViewerView extends Component<RouteComponentProps, State> {

    state = {
        redirect: false,
        guideId: null,
        pdfFile: null,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
    }

    componentDidMount() {
        // @ts-ignore
        const guideId = Number(this.props.match.params.id);
        this.setState({guideId});
        const filename = new URLSearchParams(window.location.search).get('filename');
        getGuideFile(guideId, filename)
            .then(data => this.setState({pdfFile: URL.createObjectURL(base64ToBlob(data))}))
            .catch(message => {
                alert(message);
                this.setState({redirect: true});
            });

        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={`/guide/${this.state.guideId}`} />;
        }

        return (
            <div>
                <Link to="/" className="viewer-btn pdf-viewer-home">
                    <img className="viewer-btn-img" src={require('../../../assets/home.png')} alt="Return home" />
                </Link>
                <Link to={`/guide/${this.state.guideId}`} className="viewer-btn pdf-viewer-return">
                    <img className="viewer-btn-img" src={require('../../../assets/return.png')} alt="Return to guide" />
                </Link>

                <iframe src={this.state.pdfFile} className="pdf-viewer" title="pdf-viewer"
                        width={this.state.windowWidth} height={this.state.windowHeight} />
            </div>
        );
    }
}