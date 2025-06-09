export interface Dimension {
    id: string,
    name: string;
}

export interface Topic {
    id: string;
    name: string;
    description: string;
    dimension: Dimension
}