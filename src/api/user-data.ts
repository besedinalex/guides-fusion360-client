import axios from 'axios';
import {serverURL} from './server-address';
import User from "../interfaces/user";

export let isAuthenticated: boolean;
export let userAccess: string;

export function getToken(email: string, password: string): Promise<null> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/users/token`, {params: {email, password}})
            .then(async res => {
                await handleAuthentication(res.data.data);
                resolve();
            })
            .catch(err => reject(err.response.data.message));
    });
}

export function postNewUser(firstName: string, lastName: string, email: string, password: string): Promise<null> {
    return new Promise((resolve, reject) => {
        axios.post(`${serverURL}/users/new`, {email, firstName, lastName, password})
            .then(async res => {
                await handleAuthentication(res.data.data);
                resolve();
            })
            .catch(err => reject(err.response.data.message));
    });
}

export function getPasswordRestoreCode(email: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/users/password-restore-code`, {params: {email}})
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    })
}

export function restorePassword(restoreCode: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
        axios.put(`${serverURL}/users/restore-password`, null, {params: {restoreCode, password}})
            .then(res => {
                handleAuthentication(res.data.data);
                resolve();
            })
            .catch(err => reject(err.response.data.message));
    });
}

export function getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/users/all`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function updateUserAccess(email: string, access: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axios.put(`${serverURL}/users/access`, {email, access})
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    })
}

export function deleteUser(email: string): Promise<number> {
    return new Promise((resolve, reject) => {
        axios.delete(`${serverURL}/users/user`, {params: {email}})
            .then(res => resolve(res.data.damp))
            .catch(err => reject(err.response.data.message));
    })
}

export function signOut() {
    localStorage.removeItem('token');
    window.location.reload();
}

async function handleAuthentication(token: string) {
    localStorage.setItem('token', token);
    await updateAuthData();
}

export async function updateAuthData() {
    const token = localStorage.getItem('token');
    isAuthenticated = token !== null;
    if (isAuthenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            const userAccessReq = await axios.get(`${serverURL}/users/access-self`);
            userAccess = userAccessReq.data.data;
        } catch (e) {
            if (e.response.status === 401) {
                signOut();
            }
            alert(e.response.data.message);
        }
    }
}
