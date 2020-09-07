import axios from 'axios';
import {serverURL} from "./server-address";
import ModelAnnotation from "../interfaces/model-annotation";
import {isAuthenticated} from "./user-data";

export function getModelAnnotations(modelId: number): Promise<ModelAnnotation[]> {
    return new Promise((resolve, reject) => {
        const route = isAuthenticated ? 'all' : 'all-public';
        axios.get(`${serverURL}/model-annotations/${route}/${modelId}`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function postModelAnnotation(guideId: number, x: number, y: number, z: number, name: string, text: string): Promise<number> {
    return new Promise((resolve, reject) => {
        axios.post(`${serverURL}/model-annotations/new`, {guideId, x, y, z, name, text})
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}

export function deleteModelAnnotation(annotationId: number): Promise<any> {
    return new Promise((resolve, reject) => {
        axios.delete(`${serverURL}/model-annotations/annotation/${annotationId}`)
            .then(res => resolve(res.data.data))
            .catch(err => reject(err.response.data.message));
    });
}