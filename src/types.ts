export type Guide = {
    id: number;
    name: string;
    description: string;
}

export type PartGuide = {
    id: number;
    name: string;
    content: string;
    sortKey: number;
}

export type User = {
    email: string;
    firstName: string;
    lastName: string;
    access?: string;
}

export type ModelAnnotation = {
    index?: number;
    id: number;
    x: number;
    y: number;
    z: number;
    name: string;
    text: string;
}