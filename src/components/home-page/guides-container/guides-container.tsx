import React, {Component} from "react";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import GuideCard from "../guide-card/guide-card";
import Guide from "../../../interfaces/guide";
import {getAllGuides} from "../../../services/guides";
import './guide-container.sass';

export default class GuidesContainer extends Component {
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
                <Header />
                <div className="album py-5">
                    <div className="container">
                        <div className="row">
                            {this.state.guides.map((guide: Guide, i) => {
                                return(
                                    <GuideCard
                                        imageName={guide.imageName} name={guide.name}
                                        description={guide.description} id={guide.id} key={i}
                                    />);
                            })}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}
