type PreviewImage = {
    guideId: number;
    image: string;
}

type PartGuideFile = {
    guideId: number;
    filename: string;
    file: string;
}

type ModelFile = {
    guideId: number;
    model: string;
}

const previews: PreviewImage[] = [];
const partGuides: PartGuideFile[] = [];
const models: ModelFile[] = [];

export function getPreviewImage(guideId: number): string {
    for (const preview of previews) {
        if (preview.guideId === guideId) {
            return preview.image;
        }
    }
    return null;
}

export function addPreviewImage(guideId: number, image: string) {
    previews.push({guideId, image});
}

export function getPartGuideFile(guideId: number, filename: string): string {
    for (const partGuide of partGuides) {
        if (partGuide.guideId === guideId && partGuide.filename === filename) {
            return partGuide.file;
        }
    }
    return null;
}

export function addPartGuideFile(guideId: number, filename: string, file: string) {
    partGuides.push({guideId, filename, file});
}

export function removePartGuideFile(guideId: number, filename: string) {
    for (let i = 0; i < partGuides.length; i++) {
        const partGuide = partGuides[i];
        if (partGuide.guideId === guideId && partGuide.filename === filename) {
            partGuides.splice(i, 1);
            return;
        }
    }
}

export function getModelFile(guideId: number): string {
    for (const model of models) {
        if (model.guideId === guideId) {
            return model.model;
        }
    }
    return null;
}

export function addModelFile(guideId: number, model: string) {
    models.push({guideId, model});
}

export function removeModelFile(guideId: number) {
    for (let i = 0; i < models.length; i++) {
        if (models[i].guideId === guideId) {
            models.splice(i, 1);
            return;
        }
    }
}