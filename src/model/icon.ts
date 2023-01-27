export class Icon {
    id: number;
    title: string;
    tags: string[];
    url: string;
    constructor(id: number, title: string, tags: string[], url: string) {
        this.id = id;
        this.title = title;
        this.tags = tags;
        this.url = url;
    }
}