import axios from 'axios';
import {serverURL} from "./server-address";
import ModelAnnotation from "../interfaces/model-annotation";

export function getModelAnnotations(modelId): Promise<Array<ModelAnnotation>> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/annotations/all?guideId=${modelId}`)
            .then(data => resolve(data.data)).catch(reject);
    });
}
