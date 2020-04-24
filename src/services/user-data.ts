import axios from 'axios';
import {serverURL} from './server-address';

let session;
let isAuthenticated;
let token;

function getToken(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/user/token?email=${email}&password=${password}`)
            .then(res => {
                handleAuthentication(res.data);
                resolve();
            })
            .catch(err => reject(err.response.data.message));
    });
}

function postNewUser(firstName: string, lastName: string, email: string, password: string, group: string): Promise<any> {
    return new Promise((resolve, reject) => {
        axios.post(`${serverURL}/user/new?firstName=${firstName}&lastName=${lastName}&email=${email}&password=${password}&group=${group}`)
            .then(res => {
                handleAuthentication(res.data);
                resolve();
            })
            .catch(err => reject(err.response.data.message));
    });
}

function signOut() {
    localStorage.removeItem('session');
    window.location.reload();
}

function handleAuthentication(session) {
    localStorage.setItem('session', JSON.stringify(session));
    updateAuthData();
}

function updateAuthData() {
    session = JSON.parse(localStorage.getItem('session'));
    isAuthenticated = session !== null;
    token = session !== null ? session['token'] : undefined;
}

updateAuthData();

export {isAuthenticated, token, getToken, postNewUser, signOut}
