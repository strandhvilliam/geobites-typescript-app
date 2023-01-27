import { Article } from './article';
import { Icon } from './icon';
import icons from './icons.json';
import type { InputData, LocationData } from './data-types';

interface State {
    articles: Article[];
    position: number[],
    icons: Icon[],
    sortOptions: string[],
}



const state: State = {
    articles: [],
    position: [],
    icons: [],
    sortOptions: ['All', 'Newest', 'Oldest', 'Highest Rated', 'Alphabetical'],
};


export const getPosition = async () => {
    try {
        await findPosition();
    } catch (error) {
        console.log(error);
    }
    return state.position;

};

export const getReverseGeolocationData = async (lat: number, lng: number) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
    // const res = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=175088814934904234572x79855`);
    const data = await res.json();
    console.log(data);
    const locData: LocationData = {
        title: data.name ? data.name : data.display_name.split(',').slice(0, 2).join(','),
        address: data.address.road ? data.address.road : data.address.municipality,
        houseNumber: data.address.house_number ? data.address.house_number : '',
        coordinates: [lat, lng],
        date: new Date().toLocaleDateString("sv-SE"),
    }
    return locData;
};

const getDistance = (userLat: number, userLng: number, artLat: number, artLng: number): number => {
    // Haversine formula
    const R = 6371e3;
    const q1 = userLat * Math.PI / 180;
    const q2 = artLat * Math.PI / 180;
    const deltaQ = (artLat - userLat) * Math.PI / 180;
    const deltaL = (artLng - userLng) * Math.PI / 180;

    const a = Math.sin(deltaQ / 2) * Math.sin(deltaQ / 2) +
        Math.cos(q1) * Math.cos(q2) *
        Math.sin(deltaL / 2) * Math.sin(deltaL / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return +(d / 100).toFixed(1);
}

export const getIcons = (): Icon[] => {
    return state.icons;
};

export const getSortOptions = (): string[] => {
    return state.sortOptions;
}


export const addArticle = (data: InputData) => {

    const icon: Icon = state.icons.find((icon) => icon.tags.includes(data.tags[0])) ?? state.icons[7];
    const distance = getDistance(state.position[0], state.position[1], data.coordinates[0], data.coordinates[1]);
    console.log(distance);
    const article: Article = new Article(data.title, data.address, data.coordinates, data.tags, data.description, data.date, data.link, data.rating, distance, icon);
    state.articles.push(article);
    setLocalStorage();
};

export const getArticles = (): Article[] => {
    return state.articles;
};

export const editArticle = (data: InputData) => {
    const article: Article = state.articles.find((article) => article.id === data.id)!;
    const icon: Icon = state.icons.find((icon) => data.iconId === icon.id)!;

    article.title = data.title;
    article.address = data.address;
    article.coordinates = data.coordinates;
    article.tags = data.tags;
    article.description = data.description;
    article.date = data.date;
    article.link = data.link;
    article.rating = data.rating;
    article.icon = icon;
    article.id = data.id;
    setLocalStorage();
}
export const deleteArticle = (id: number) => {
    const index = state.articles.findIndex(el => el.id === id);
    state.articles.splice(index, 1);
    setLocalStorage();
};

const setLocalStorage = () => {
    localStorage.setItem('articles', JSON.stringify(state.articles));
};

export const loadLocalStorage = () => {
    const storage = localStorage.getItem('articles');
    if (storage) {
        const articles = JSON.parse(storage);
        state.articles = articles.map((article: Article) => {
            const icon: Icon = new Icon(article.icon.id, article.icon.title, article.icon.tags, article.icon.url);
            return new Article(article.title, article.address, article.coordinates, article.tags, article.description, article.date, article.link, article.rating, article.distance, icon, article.id);
        });
    }
};

export const loadIcons = () => {
    if (state.icons.length === 0) {
        Object.values(icons).forEach((icon: any) => {
            state.icons.push(new Icon(icon.id, icon.title, icon.tags, icon.url));
        });
    }
};

const findPosition = async () => {
    return new Promise<void>((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                state.position = [lat, lng];
                resolve();
            }, (error) => {
                alert('Could not get your position');
                reject(error);
            });
        }
    });

};