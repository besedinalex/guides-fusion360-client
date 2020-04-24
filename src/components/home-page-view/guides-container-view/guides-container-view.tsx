import React, {Component} from "react";
import HeaderComponent from "../../header-component/header-component";
import FooterComponent from "../../footer-component/footer-component";
import GuideCardComponent from "../guide-card-component/guide-card-component";
import Guide from "../../../interfaces/guide";
import {getAllGuides} from "../../../api/guides";

interface State {
    guides: Array<Guide>;
}

export default class GuidesContainerView extends Component<{}, State> {

    state = {
        guides: []
    };

    constructor(props: Readonly<{}>) {
        super(props);
        getAllGuides().then(data => this.setState({guides: data}));
    }

    render() {
        return (
            <div>
                <HeaderComponent />
                <div className="album margin-after-header py-5">
                    <div className="container">
                        <div className="row">
                            {this.state.guides.map((guide: Guide, i) => {
                                return (
                                    <GuideCardComponent name={guide.name} description={guide.description} id={guide.id}
                                                        key={i} />
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
