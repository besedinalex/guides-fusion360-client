import axios from 'axios';
import Guide from "../interfaces/guide";
import PartGuide from "../interfaces/part-guide";
import {isAuthenticated} from "./user-data";
import User from "../interfaces/user";
import {arrayBufferToBase64} from "../services/base64";

// Dev server
if (window.location.port === '3000') {
    axios.defaults.baseURL = `http://${window.location.hostname}:4004`;
}

export function getPublicGuides(): Promise<Guide[]> {
    return new Promise((resolve, reject) => {
        axios.get(`/guides/all`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}

export function getHiddenGuides(): Promise<Guide[]> {
    return new Promise((resolve, reject) => {
        axios.get(`/guides/all-hidden`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}

export function getGuideFile(guideId: number, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const route = isAuthenticated ? 'file' : 'file-public';
        axios.get(`/guides/${route}/${guideId}`, {responseType: 'arraybuffer', params: {filename}})
            .then(res => {
                const base64 = arrayBufferToBase64(res.data);
                const contentType = res.headers['content-type'];
                resolve(contentType === 'application/pdf' ? base64 : `data:${contentType};base64,` + base64);
            })
            .catch(err => {
                // Decodes arraybuffer to string and parses it for json object
                const errResponse = JSON.parse(new TextDecoder("utf-8").decode(err.response.data));
                reject(errResponse.messageRu)
            });
    });
}

export function getPartGuides(guideId: number): Promise<PartGuide[]> {
    return new Promise((resolve, reject) => {
        const route = isAuthenticated ? 'parts' : 'parts-public';
        axios.get(`/guides/${route}/${guideId}`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}

export function getGuideOwner(guideId: number): Promise<User> {
    return new Promise((resolve, reject) => {
        axios.get(`/guides/owner/${guideId}`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}

export function postNewGuide(name: string, description: string, image: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('description', description);
        bodyFormData.append('image', image);

        axios.post(`/guides/guide`, bodyFormData)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
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

        axios.post(`/guides/part-guide`, bodyFormData)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}

export function postModel(guideId: number, file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const bodyFormData = new FormData();
        bodyFormData.append('guideId', String(guideId));
        bodyFormData.append('file', file)

        axios.post(`/guides/model`, bodyFormData)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}

export function putPartGuide(id: number, name: string, content: string | File): Promise<number> {
    return new Promise((resolve, reject) => {
        const bodyFormData = new FormData();
        bodyFormData.append('name', name);
        // I was definitely insane when I thought this was a good idea to begin with
        bodyFormData.append(typeof content === 'string' ? 'content' : 'file', content);

        axios.put(`/guides/part-guide/${id}`, bodyFormData)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}

export function putPartGuidesSortKey(partGuideId1: number, partGuideId2: number): Promise<null> {
    return new Promise((resolve, reject) => {
        axios.put(`/guides/switch`, null, {params: {partGuideId1, partGuideId2}})
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}

export function updateGuideVisibility(id: number, hidden: boolean): Promise<number> {
    return new Promise((resolve, reject) => {
        axios.put(`/guides/hidden/${id}`, null, {params: {hidden}})
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}

export function removeGuide(id: number): Promise<null> {
    return new Promise((resolve, reject) => {
        axios.delete(`/guides/guide/${id}`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}

export function removePartGuide(id: number): Promise<null> {
    return new Promise((resolve, reject) => {
        axios.delete(`/guides/part-guide/${id}`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}