import {userAccess} from "../api/user-data";
import {getGuideOwner, getPartGuides} from "../api/guides";
import {PartGuide} from "../types";

export async function getPartGuidesSorted(guideId: number): Promise<PartGuide[]> {
    try {
        const guides = await getPartGuides(guideId);
        guides.sort(((a, b) => a.sortKey - b.sortKey));
        return guides;
    } catch (message) {
        alert(message);
    }
}

export async function getGuideOwnerInfo(guideId: number): Promise<string> {
    try {
        if (userAccess === 'editor' || userAccess === 'admin') {
            const owner = await getGuideOwner(guideId);
            return `${owner.firstName} ${owner.lastName} ${owner.email}`;
        }
    } catch (message) {
        alert(message);
    }
}
