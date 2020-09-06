import axios from 'axios';
import {serverURL} from './server-address';

let isAuthenticated;
let userAccess;
let token;

function getUserAccess(): Promise<any> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/users/access-self`)
            .then(res => {
                localStorage.setItem('access', res.data.data);
                resolve();
            })
            .catch(err => {
                if (err.response.status === 401) {
                    signOut();
                }
                reject(err.response.data.message);
            });
    });
}

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
        getUserAccess()
            .then(() => userAccess = localStorage.getItem('access'))
            .catch(err => alert(err));
    }
}

updateAuthData();

export {isAuthenticated, token, userAccess, getToken, postNewUser, restorePassword, signOut}
