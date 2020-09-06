import React, {Component} from "react";
import HeaderComponent from "../../header-component/header-component";
import FooterComponent from "../../footer-component/footer-component";
import GuideCardComponent from "../guide-card-component/guide-card-component";
import Guide from "../../../interfaces/guide";
import {getAllGuides, getAllHiddenGuides} from "../../../api/guides";
import {Redirect} from "react-router-dom";

interface State {
    hidden: boolean;
    guides: Array<Guide>;
    redirect: boolean;
}

interface Props {
    path: string
}

export default class GuidesContainerView extends Component<Props, State> {

    state = {
        hidden: false,
        guides: [],
        redirect: false
    };

    componentDidMount() {
        const hidden = this.props.path === '/hidden';
        this.setState({hidden});
        if (hidden) {
            getAllHiddenGuides()
                .then(data => this.setState({guides: data}))
                .catch(message => {
                    alert(message);
                    this.setState({redirect: true});
                });
        } else {
            getAllGuides()
                .then(data => this.setState({guides: data}))
                .catch(message => alert(message));
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }
        return (
            <div>
                <HeaderComponent />
                <div className="album margin-after-header margin-before-footer py-5">
                    <div className="container">
                        <div className="row">
                            {this.state.guides.map((guide: Guide, i) => {
                                return (
                                    <GuideCardComponent name={guide.name} description={guide.description} id={guide.id}
                                                        hidden={this.state.hidden} key={i} />
                                );
                            })}
                        </div>
                    </div>
                </div>
                <FooterComponent />
            </div>
        );
    }
}
