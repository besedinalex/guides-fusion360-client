import React, {Component} from "react";
import './footer-component.sass';

export default class FooterComponent extends Component {

    render() {
        return (
            <footer className="bg-dark py-2 fixed-bottom">
                <div className="container">
                    <span>
                        Гайды разработаны студентами <a className="text-warning" href="https://mospolytech.ru">Московского Политеха</a>.
                    </span>
                    <br />
                    <span>
                        Узнать больше про Fusion 360 можно на сайте <a className="text-warning"
                                                                       href="https://autodesk.com/products/fusion-360/overview">Autodesk</a>.
                    </span>
                </div>
            </footer>
        );
    }
}
