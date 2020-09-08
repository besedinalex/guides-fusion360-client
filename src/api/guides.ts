import axios from 'axios';
import {serverURL} from "./server-address";
import Guide from "../interfaces/guide";
import PartGuide from "../interfaces/part-guide";
import {isAuthenticated} from "./user-data";
import User from "../interfaces/user";
import {arrayBufferToBase64} from "../services/base64";

export function getPublicGuides(): Promise<Guide[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/guides/all`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function getHiddenGuides(): Promise<Guide[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/guides/all-hidden`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function getGuideFile(guideId: number, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const route = isAuthenticated ? 'file' : 'file-public';
        axios.get(`${serverURL}/guides/${route}/${guideId}`, {responseType: 'arraybuffer', params: {filename}})
            .then(res => {
                const base64 = arrayBufferToBase64(res.data);
                const contentType = res.headers['content-type'];
                resolve(contentType === 'application/pdf' ? base64 : `data:${contentType};base64,` + base64);
            })
            .catch(err => {
                // Decodes arraybuffer to string and parses it for json object
                const errResponse = JSON.parse(new TextDecoder("utf-8").decode(err.response.data));
                reject(errResponse.message)
            });
    });
}

export function getPartGuides(guideId: number): Promise<PartGuide[]> {
    return new Promise((resolve, reject) => {
        const route = isAuthenticated ? 'parts' : 'parts-public';
        axios.get(`${serverURL}/guides/${route}/${guideId}`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function getGuideOwner(guideId: number): Promise<User> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/guides/owner/${guideId}`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function postNewGuide(name: string, description: string, image: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('description', description);
        bodyFormData.append('image', image);

        axios.post(`${serverURL}/guides/guide`, bodyFormData)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function postNewPartGuide(guideId: number, name: string, data: File | string, sortKey: number): Promise<number> {
    return new Promise((resolve, reject) => {
        const bodyFormData = new FormData();
        bodyFormData.append('guideId', String(guideId));
        bodyFormData.append('name', name);
        bodyFormData.append('sortKey', String(sortKey));
        // I was definitely insane when I thought this was a good idea to begin with
        bodyFormData.append(typeof data === 'string' ? 'content' : 'file', data);

        axios.post(`${serverURL}/guides/part-guide`, bodyFormData)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function postModel(guideId: number, file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const bodyFormData = new FormData();
        bodyFormData.append('guideId', String(guideId));
        bodyFormData.append('file', file)

        axios.post(`${serverURL}/guides/model`, bodyFormData)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function putPartGuide(id: number, name: string, content: string | File): Promise<number> {
    return new Promise((resolve, reject) => {
        const bodyFormData = new FormData();
        bodyFormData.append('name', name);
        // I was definitely insane when I thought this was a good idea to begin with
        bodyFormData.append(typeof content === 'string' ? 'content' : 'file', content);

        axios.put(`${serverURL}/guides/part-guide/${id}`, bodyFormData)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function putPartGuidesSortKey(partGuideId1: number, partGuideId2: number): Promise<null> {
    return new Promise((resolve, reject) => {
        axios.put(`${serverURL}/guides/switch`, null, {params: {partGuideId1, partGuideId2}})
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function updateGuideVisibility(id: number, hidden: boolean): Promise<number> {
    return new Promise((resolve, reject) => {
        axios.put(`${serverURL}/guides/hidden/${id}`, null, {params: {hidden}})
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function removeGuide(id: number): Promise<null> {
    return new Promise((resolve, reject) => {
        axios.delete(`${serverURL}/guides/guide/${id}`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function removePartGuide(id: number): Promise<null> {
    return new Promise((resolve, reject) => {
        axios.delete(`${serverURL}/guides/part-guide/${id}`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}