import axios from 'axios';
import {serverURL} from './server-address';
import User from "../interfaces/user";

let isAuthenticated;
let userAccess;
let token;

function getUserAccess(): Promise<string> {
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
                getUserAccess()
                    .then(() => resolve())
                    .catch(message => alert(message));
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

function getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/users/all`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

function updateUserAccess(email: string, access: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axios.put(`${serverURL}/users/access`, {email, access})
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    })
}

function deleteUser(email: string): Promise<number> {
    return new Promise((resolve, reject) => {
        axios.delete(`${serverURL}/users/user`, {params: {email}})
            .then(res => resolve(res.data.damp))
            .catch(err => reject(err.response.data.message));
    })
}

function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('access');
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
        userAccess = localStorage.getItem('access');
        getUserAccess()
            .then(() => userAccess = localStorage.getItem('access'))
            .catch(message => alert(message));
    }
}

updateAuthData();

export {
    isAuthenticated,
    token,
    userAccess,
    getToken,
    postNewUser,
    restorePassword,
    getAllUsers,
    updateUserAccess,
    deleteUser,
    signOut
}
