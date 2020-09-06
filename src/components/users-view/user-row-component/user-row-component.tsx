import React, {Component} from "react";
import User from '../../../interfaces/user';
import Glyphicon from '@strongdm/glyphicon';
import {deleteUser, getPasswordRestoreCode, updateUserAccess} from "../../../api/user-data";

interface State {
    color: string;
    access: string;
    title: string;
    glyph: string;
    newAccess: string;
    isAdmin: boolean;
}

export default class UserRowComponent extends Component<User, State> {

    state = {
        color: '',
        access: '',
        title: '',
        glyph: '',
        newAccess: '',
        isAdmin: false
    }

    componentDidMount() {
        switch (this.props.access) {
            case 'admin':
                this.setState({
                    color: 'table-success',
                    access: 'Администратор',
                    isAdmin: true
                });
                break;
            case 'editor':
                this.setState({
                    color: 'table-primary',
                    access: 'Редактор',
                    title: 'Сделать пользователем',
                    glyph: 'user',
                    newAccess: 'unknown'
                });
                break;
            default:
                this.setState({
                    color: 'table-warning',
                    access: 'Пользователь',
                    title: 'Сделать редактором',
                    glyph: 'pencil',
                    newAccess: 'editor'
                });
        }
    }

    handleAccessChange = access => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm(`Вы уверены, что хотите изменить уровень доступа пользователя ${this.props.firstName} ${this.props.lastName}?`)) {
            updateUserAccess(this.props.email, access)
                .then(() => window.location.reload())
                .catch(message => alert(message));
        }
    }

    handleGetPasswordRestoreCode = () => {
        getPasswordRestoreCode(this.props.email)
            .then(code => alert(`Сообщите пользователю ${this.props.firstName} ${this.props.lastName} код ${code}.`))
            .catch(message => alert(message));
    }

    handleUserDelete = () => {
        const message =
            `Вы уверены, что хотите удалить пользователя ${this.props.firstName} ${this.props.lastName}? ` +
            'После удаления все гайды пользователя будут отмечены как ваши.';
        // eslint-disable-next-line no-restricted-globals
        if (confirm(message)) {
            deleteUser(this.props.email)
                .then(() => window.location.reload())
                .catch(message => alert(message));
        }
    }

    render() {
        return (
            <tr className={this.state.color}>
                <th>{this.props.firstName} {this.props.lastName}</th>
                <td>{this.props.email}</td>
                <td>{this.state.access}</td>
                <td>
                    <button className="btn btn-sm m-0 p-0" title="Запросить код для восстановления пароля"
                            onClick={this.handleGetPasswordRestoreCode}>
                        <Glyphicon glyph="exclamation-sign" />
                    </button>
                </td>
                <td>
                    <button className="btn btn-sm m-0 p-0" hidden={this.state.isAdmin} title={this.state.title}
                            onClick={() => this.handleAccessChange(this.state.newAccess)}>
                        <Glyphicon glyph={this.state.glyph} />
                    </button>
                </td>
                <td>
                    <button className="btn btn-sm m-0 p-0" hidden={this.state.isAdmin} title="Удалить пользователя"
                            onClick={this.handleUserDelete}>
                        <Glyphicon glyph="remove" />
                    </button>
                </td>
            </tr>
        );
    }
}