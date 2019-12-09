import axios from 'axios';
import {serverURL} from './server-address';

let session;

export let isAuthenticated;
export let token;
export let userId;

updateAuthData();

export function handleSigningUp(firstName: string, lastName: string, email: string, password: string, inviteCode: string, group: string): Promise<any> {
    return new Promise((resolve, reject) => {
        (axios.post(`${serverURL}/user/new?firstName=${firstName}&lastName=${lastName}&email=${email}&password=${password}&inviteCode=${inviteCode}&group=${group}`)
            .then(res => {
                if (res.status === 200) {
                    handleAuthentication(res.data);
                }
            })).then(resolve).catch(reject);
    });
}

export function handleSigningIn(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
        (axios.get(`${serverURL}/user/token?email=${email}&password=${password}`)
            .then(res => {
                if (res.status === 200)
                    handleAuthentication(res.data);
            })).then(resolve).catch(reject);
    });
}

export function handleSigningOut() {
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
