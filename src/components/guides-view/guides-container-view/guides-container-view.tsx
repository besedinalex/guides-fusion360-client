import React, {Component} from "react";
import {RouteComponentProps} from "react-router";
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

export default class GuidesContainerView extends Component<RouteComponentProps, State> {

    state = {
        hidden: false,
        guides: [],
        redirect: false
    };

    componentDidMount() {
        // @ts-ignore
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
                <div className="album margin-after-header py-5">
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
