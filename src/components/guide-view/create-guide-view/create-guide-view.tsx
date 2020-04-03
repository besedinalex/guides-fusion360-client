import React, {Component} from "react";
import HeaderComponent from "../../header-component/header-component";
import './create-guide-view.sass';
import {postNewGuide} from "../../../services/guides";
import {Redirect} from "react-router-dom";

interface State {
    name: string;
    description: string;
    img: any;
    redirect: boolean;
}

export default class CreateGuideView extends Component<{}, State> {

    imgInput: React.RefObject<any>;
    state = {
        name: '',
        description: '',
        img: require('../../../assets/logo250.jpg'),
        redirect: false
    };

    componentDidMount() {
        this.imgInput = React.createRef();
    }

    handleImgChange = (event) => {
        try {
            this.setState({img: URL.createObjectURL(event.target.files[0])});
        } catch (e) {
            alert('Не удалось изменить изображение.');
        }
    };

    handleNameChange = (event) => this.setState({name: event.target.value});

    handleDescriptionChange = (event) => this.setState({description: event.target.value});

    handleSubmit = (event) => {
        event.preventDefault();
        postNewGuide(this.state.name, this.state.description, this.imgInput.current.files[0])
            .then(() => this.setState({redirect: true}))
            .catch(() => alert('Не удалось создать гайд.'));
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />;
        }
        return (
            <div>
                <HeaderComponent />

                <div className="container margin-after-header py-4">
                    <h3>Создание гайда</h3>

                    <form className="form">
                        <div className="form-group image-upload">
                            <label>Изображение</label>
                            <br />
                            <label htmlFor="image-input">
                                <img src={this.state.img} alt="Изображение 3D-модели" />
                            </label>
                            <input type="file" id="image-input" name="img" ref={this.imgInput}
                                   onChange={this.handleImgChange} />
                        </div>

                        <div className="form-group">
                            <label>Название</label>
                            <input type="text" className="form-control" onChange={this.handleNameChange}
                                   placeholder="Сборка" />
                        </div>

                        <div className="form-group">
                            <label>Краткое описание</label>
                            <textarea className="form-control" onChange={this.handleDescriptionChange}
                                      placeholder="В данном уроке вы..." />
                        </div>

                        <button className="btn btn-success" onClick={this.handleSubmit}>Создать</button>
                    </form>
                </div>
            </div>
        );
    }
}
