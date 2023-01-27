import type { Icon } from './icon';

export class Article {
    title: string;
    address: string;
    coordinates: number[];
    tags: string[];
    description: string;
    date: string;
    link: string;

    rating: number;
    distance: number;

    icon: Icon;
    id?: number;

    constructor(title: string, address: string, coordinates: number[], tags: string[], description: string, date: string, link: string, rating: number, distance: number, icon: Icon, id?: number) {
        this.title = title;
        this.address = address;
        this.coordinates = coordinates;
        this.tags = tags;
        this.description = description;
        this.date = date;
        this.link = link;
        this.rating = rating;
        this.distance = distance;
        this.icon = icon;
        this.id = id ? id : +(Date.now() + "").slice(-10);
    }

}