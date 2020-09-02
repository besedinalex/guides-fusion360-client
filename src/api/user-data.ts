import axios from 'axios';
import {serverURL} from './server-address';

let isAuthenticated;
let token;

function getToken(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/users/token`, {params: {email, password}})
            .then(res => {
                handleAuthentication(res.data.data);
                resolve();
            })
            .catch(err => reject(err.response.data.message));
    });
}

function postNewUser(firstName: string, lastName: string, email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
        axios.post(`${serverURL}/users/new`, {email, firstName, lastName, password})
            .then(res => {
                handleAuthentication(res.data.data);
                resolve();
            })
            .catch(err => reject(err.response.data.message));
    });
}

function restorePassword(restoreCode: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
        axios.put(`${serverURL}/users/restore-password`, null, {params: {restoreCode, password}})
            .then(res => {
                handleAuthentication(res.data.data);
                resolve();
            })
            .catch(err => reject(err.response.data.message));
    });
}

function signOut() {
    localStorage.removeItem('token');
    window.location.reload();
}

function handleAuthentication(session) {
    localStorage.setItem('token', session);
    updateAuthData();
}

function updateAuthData() {
    token = localStorage.getItem('token');
    isAuthenticated = token !== null;
    if (isAuthenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}

updateAuthData();

export {isAuthenticated, token, getToken, postNewUser, restorePassword, signOut}
