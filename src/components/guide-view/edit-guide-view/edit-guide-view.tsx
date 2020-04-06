import React, {Component} from "react";
import Glyphicon from '@strongdm/glyphicon';
import HeaderComponent from "../../header-component/header-component";

export default class EditGuideView extends Component {
    render() {
        return (
            <div>
                <HeaderComponent />

                <div className="container margin-after-header py-5 justify-content-center">
                    <div className="list-group w-50 m-auto">

                        <button className="list-group-item list-group-item-success">
                            <span className="float-left">
                                Какой-то гайд
                            </span>
                            <button className="float-right badge badge-white">
                                <Glyphicon glyph="chevron-down" />
                            </button>
                            <button className="float-right badge badge-white">
                                <Glyphicon glyph="chevron-up" />
                            </button>
                        </button>


                        <button className="list-group-item list-group-item-danger">
                            Создать гайд
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
