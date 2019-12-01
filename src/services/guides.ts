import axios from 'axios';
import {serverURL} from "./server-address";
import Guide from "../interfaces/guide";

export function getAllGuides(): Promise<Array<Guide>> {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/guide/all`)
            .then(data => resolve(data.data)).catch(reject);
    });
}
