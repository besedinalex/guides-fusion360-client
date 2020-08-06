import axios from 'axios';
import {serverURL} from "./server-address";
import Guide from "../interfaces/guide";
import PartGuide from "../interfaces/part-guide";
import {signOut, token} from "./user-data";

export function getAllGuides(): Promise<Guide[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/guides/all`)
            .then(data => resolve(data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function getAllHiddenGuides(): Promise<Guide[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/guides/all-hidden?token=${token}`)
            .then(data => resolve(data.data))
            .catch(err => {
                if (err.response.status === 401) {
                    signOut();
                }
                reject(err.response.data.message);
            });
    });
}

export function getPartGuides(guideId: number): Promise<PartGuide[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/guides/parts?guideId=${guideId}`)
            .then(data => resolve(data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function postNewGuide(name: string, description: string, img: File) {
    return new Promise((resolve, reject) => {
        const bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('description', description);
        bodyFormData.append('img', img);

        axios({
            method: 'post',
            url: `${serverURL}/guides/guide?token=${token}`,
            data: bodyFormData
        })
            .then(resolve)
            .catch(err => {
                if (err.response.status === 401) {
                    signOut();
                }
                reject(err.response.data.message);
            });
    });
}

export function postNewPartGuide(guideId: number, name: string, file: File | string, sortKey: number) {
    return new Promise((resolve, reject) => {
        const bodyFormData = new FormData();
        bodyFormData.append('guideId', String(guideId));
        bodyFormData.append('name', name);
        bodyFormData.append('file', file);
        bodyFormData.append('sortKey', String(sortKey));

        axios({
            method: 'post',
            url: `${serverURL}/guides/part-guide?token=${token}`,
            data: bodyFormData
        })
            .then(resolve)
            .catch(err => {
                if (err.response.status === 401) {
                    signOut();
                }
                reject(err.response.data.message);
            });
    });
}

export function postModel(guideId: number, file: File) {
    return new Promise((resolve, reject) => {
        const bodyFormData = new FormData();
        bodyFormData.append('guideId', String(guideId));
        bodyFormData.append('file', file)

        axios({
            method: 'post',
            url: `${serverURL}/guides/model?token=${token}`,
            data: bodyFormData
        })
            .then(resolve)
            .catch(err => {
                if (err.response.status === 401) {
                    signOut();
                }
                reject(err.response.data.message);
            });
    });
}

export function putHidden(guideId: number, hidden: string) {
    return new Promise((resolve, reject) => {
        axios.put(`${serverURL}/guides/hidden?token=${token}&guideId=${guideId}&hidden=${hidden}`)
            .then(resolve)
            .catch(err => {
                if (err.response.status === 401) {
                    signOut();
                }
                reject(err.response.data.message);
            });
    });
}

export function putPartGuide(id: number, name: string, file: any) {
    return new Promise((resolve, reject) => {
        const bodyFormData = new FormData();
        bodyFormData.append('id', String(id));
        bodyFormData.append('name', name);
        bodyFormData.append('file', file);

        axios({
            method: 'put',
            url: `${serverURL}/guides/part-guide?token=${token}`,
            data: bodyFormData
        })
            .then(resolve)
            .catch(err => {
                if (err.response.status === 401) {
                    signOut();
                }
                reject(err.response.data.message);
            });
    });
}

export function putPartGuidesSortKey(id1: number, id2: number) {
    return new Promise((resolve, reject) => {
        axios.put(`${serverURL}/guides/switch?token=${token}&id1=${id1}&id2=${id2}`)
            .then(resolve)
            .catch(err => {
                if (err.response.status === 401) {
                    signOut();
                }
                reject(err.response.data.message);
            });
    });
}
