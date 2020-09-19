import axios from 'axios';
import ModelAnnotation from "../interfaces/model-annotation";
import {isAuthenticated} from "./user-data";

// Dev server
if (window.location.port === '3000') {
    axios.defaults.baseURL = `http://${window.location.hostname}:4004`;
}

export function getModelAnnotations(modelId: number): Promise<ModelAnnotation[]> {
    return new Promise((resolve, reject) => {
        const route = isAuthenticated ? 'all' : 'all-public';
        axios.get(`/model-annotations/${route}/${modelId}`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}

export function postModelAnnotation(guideId: number, x: number, y: number, z: number, name: string, text: string): Promise<number> {
    return new Promise((resolve, reject) => {
        axios.post(`/model-annotations/new`, {guideId, x, y, z, name, text})
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}

export function deleteModelAnnotation(annotationId: number): Promise<null> {
    return new Promise((resolve, reject) => {
        axios.delete(`/model-annotations/annotation/${annotationId}`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.messageRu));
    });
}