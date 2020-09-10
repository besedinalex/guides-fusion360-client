import axios from 'axios';
import User from "../interfaces/user";

// Dev server
if (window.location.port === '3000') {
    axios.defaults.baseURL = `http://${window.location.hostname}:4004`;
}

export let isAuthenticated: boolean;
export let userAccess: string;

export function getToken(email: string, password: string): Promise<null> {
    return new Promise((resolve, reject) => {
        axios.get(`/users/token`, {params: {email, password}})
            .then(res => {
                handleAuthentication(res.data.data);
                resolve();
            })
            .catch(err => reject(err.response.data.message));
    });
}

export function postNewUser(firstName: string, lastName: string, email: string, password: string): Promise<null> {
    return new Promise((resolve, reject) => {
        axios.post(`/users/new`, {email, firstName, lastName, password})
            .then(res => {
                handleAuthentication(res.data.data);
                resolve();
            })
            .catch(err => reject(err.response.data.message));
    });
}

export function getPasswordRestoreCode(email: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axios.get(`/users/password-restore-code`, {params: {email}})
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    })
}

export function restorePassword(restoreCode: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
        axios.put(`/users/restore-password`, null, {params: {restoreCode, password}})
            .then(res => {
                handleAuthentication(res.data.data);
                resolve();
            })
            .catch(err => reject(err.response.data.message));
    });
}

export function getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
        axios.get(`/users/all`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function updateUserAccess(email: string, access: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axios.put(`/users/access`, {email, access})
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function deleteUser(email: string): Promise<number> {
    return new Promise((resolve, reject) => {
        axios.delete(`/users/user`, {params: {email}})
            .then(res => resolve(res.data.damp))
            .catch(err => reject(err.response.data.message));
    });
}

export function signOut() {
    localStorage.removeItem('token');
    window.location.reload();
}

function handleAuthentication(token: string) {
    localStorage.setItem('token', token);
    updateAuthData();
}

function updateAuthData() {
    const token = localStorage.getItem('token');
    isAuthenticated = token !== null;
    if (isAuthenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}

export async function updateAccessData() {
    if (isAuthenticated) {
        try {
            const userAccessReq = await axios.get(`/users/access-self`);
            userAccess = userAccessReq.data.data;
        } catch (e) {
            if (e.response.status === 401) {
                signOut();
            }
            alert(e.response.data.message);
        }
    }
}

updateAuthData();