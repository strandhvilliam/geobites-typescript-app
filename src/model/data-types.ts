export interface LocationData {
    title?: string;
    address?: string;
    houseNumber?: number;
    coordinates?: number[];
    date?: string;
}

export interface InputData {
    title: string;
    address: string;
    coordinates: number[];
    tags: string[];
    description: string;
    date: string;
    link: string;
    rating: number;

    iconId?: number;
    id?: number;
}