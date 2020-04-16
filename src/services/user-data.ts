import axios from 'axios';
import {serverURL} from './server-address';

let session;

export let isAuthenticated;
export let token;
export let userId;

updateAuthData();

export function getUserData(userId: number): Promise<any> {
    return new Promise((resolve, reject) =>
        axios.get(`${serverURL}/user/data?token=${token}&userId=${userId}`).then(resolve).catch(reject));
}

export function getSelfData(): Promise<any> {
    return new Promise((resolve, reject) =>
        axios.get(`${serverURL}/user/data-self?token=${token}`).then(resolve).catch(reject));
}

export function getToken(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
        (axios.get(`${serverURL}/user/token?email=${email}&password=${password}`)
                .then(res => handleAuthentication(res.data))
        ).then(resolve).catch(reject);
    });
}

export function postNewUser(firstName: string, lastName: string, email: string, password: string, group: string): Promise<any> {
    return new Promise((resolve, reject) => {
        (axios.post(`${serverURL}/user/new?firstName=${firstName}&lastName=${lastName}&email=${email}&password=${password}&group=${group}`)
            .then(res => handleAuthentication(res.data))
        ).then(resolve).catch(reject);
    });
}

export function deleteSelf(email: string): Promise<any> {
    return new Promise((resolve, reject) =>
        axios.delete(`${serverURL}/user/self?token=${token}&email=${email}`).then(resolve).catch(reject));
}

export function signOut() {
    localStorage.removeItem('session');
    window.location.reload();
}

function handleAuthentication(session) {
    localStorage.setItem('session', JSON.stringify(session));
    updateAuthData();
}

function updateAuthData() {
    session = JSON.parse(localStorage.getItem('session'));
    isAuthenticated = session !== null && Date.now() <= session.expiresAt;
    token = session !== null ? session['token'] : undefined;
    userId = session !== null ? session.userId : undefined;
}
