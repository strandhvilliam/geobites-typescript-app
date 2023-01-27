import * as model from './model/model';
import { Map } from './view/map';
import { ListView } from './view/listView';
import type { Article } from './model/article';
import type { LeafletMouseEvent } from 'leaflet';
import { FormView } from './view/formView';
import type { InputData, LocationData } from './model/data-types';
import { EditView } from './view/editView';
import { CategoryView } from './view/categoryView';
import { SortView } from './view/sortView';
import { IconView } from './view/iconView';


const listView = new ListView(document.querySelector('.list') as HTMLElement);
const formView = new FormView(document.querySelector('.form') as HTMLElement);
const editView = new EditView(document.querySelector('.list') as HTMLElement);
const categoryView = new CategoryView(document.querySelector('.sidebar__categories') as HTMLElement);
const sortView = new SortView(document.querySelector('.sidebar__sort-options') as HTMLElement);
const map = new Map();


const controlAddArticle = () => {
    const inputData: InputData = formView.getFormValues();
    formView.clear();
    formView.hide();
    model.addArticle(inputData);
    const articles = model.getArticles();
    const article = articles[articles.length - 1];
    displayArticle(article);
};

const controlShowEditWindow = (event: Event) => {
    const element = event.target as HTMLElement;
    const article = element.closest('.article') as HTMLElement;
    const data: Article = model.getArticles().find(a => a.id === +article.dataset.id!) as Article;
    editView.setOriginalElement(article);
    editView.render(data);
    editView.addConfirmListener(controlEditArticle);
    editView.addIconMenuListener(controlShowIconMenu);

};


const controlShowIconMenu = () => {
    const iconView = new IconView(document.querySelector('.form--edit') as HTMLElement);
    const icons = model.getIcons();
    iconView.render(icons);
    iconView.addClickListener(controlSelectIcon);
};

const controlEditArticle = () => {
    const data: InputData = editView.getEditValues();
    model.editArticle(data);
    const article: Article = model.getArticles().find(a => a.id === +data.id!) as Article;
    listView.update(article);
    listView.addEditListener(controlShowEditWindow);
    listView.addDeleteListener(controlDeleteArticle);
    listView.addMoveToLocationListener(controlMoveToLocation);
};

const controlSelectIcon = (event: Event) => {
    const iconId = +((event.target as HTMLElement).closest('.icon__item') as HTMLElement).dataset.id!;
    const icon = model.getIcons().find(i => i.id === iconId)!;
    editView.updateIcon(icon);
};

const controlDeleteArticle = (event: Event) => {
    if (event.target !== null) {
        const element = event.target as HTMLElement;
        const article = element.closest('.article') as HTMLElement;
        if (article.dataset.id !== undefined) {
            const id = +article.dataset.id;
            model.deleteArticle(id);
            listView.delete(id);
            map.removeMarker(id);
        }
    }
};

const controlMoveToLocation = (event: Event) => {
    try {
        const element = (event.target as HTMLElement).closest('.article') as HTMLElement;
        const article: Article = model.getArticles().find(a => a.id === +element.dataset.id!) as Article;
        if (article.id != undefined) {
            map.openMarkerPopup(article.id);
            map.moveToLocation(article.coordinates);
        }
    } catch (error) {
        console.log(error);
    }
};

const controlShowForm = async (evt: LeafletMouseEvent) => {
    const { lat, lng } = evt.latlng;
    const locationData: LocationData = await model.getReverseGeolocationData(lat, lng);
    formView.render(locationData);
    formView.addSaveListener(controlAddArticle);
    formView.addCancelListener(() => {
        formView.clear();
        formView.hide();
        map.removePlaceHolderMarker();
    });
    map.addPlaceHolderMarker([lat, lng]);
};

const controlShowCategories = () => {
    document.querySelector('.sidebar__categories')?.classList.toggle('hidden');
    categoryView.render(model.getIcons());
    categoryView.addCategoryClickListener(controlFilterByCategory);
};

const controlShowSortOptions = () => {
    document.querySelector('.sidebar__sort-options')?.classList.toggle('hidden');
    sortView.render(model.getSortOptions());
    sortView.addClickListener(controlSortArticles);
};

const controlFilterByCategory = (event: Event) => {
    const iconId = +((event.target as HTMLElement).closest('.category__item') as HTMLElement).dataset.id!;
    listView.clear();
    const articlesByTag = model.getArticles().filter(a => a.icon.id === iconId);
    articlesByTag.forEach(article => displayArticle(article));
    model.getArticles().forEach(article => map.removeMarker(article.id? article.id : 0));
    articlesByTag.forEach(article => map.addMarker(article));

    categoryView.hide();
    categoryView.clear();
};

const controlSortArticles = (event: Event) => {
    const sortType = ((event.target as HTMLElement).closest('.sort__option') as HTMLElement).dataset.sort;
    const articles = model.getArticles();

    switch (sortType) {
        case 'Newest':
            articles.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
            break;
        case 'Oldest':
            articles.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
            break;
        case 'Rating':
            articles.sort((a, b) => a.rating - b.rating);
            break;
        case 'Alphabetical':
            articles.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }

    listView.clear();
    articles.forEach(article => displayArticle(article));
};

const controlShowAllArticles = () => {
    listView.clear();
    model.getArticles().forEach(article => displayArticle(article));
};


const displayArticle = (article: Article) => {
    listView.render(article);
    listView.addEditListener(controlShowEditWindow);
    listView.addDeleteListener(controlDeleteArticle);
    listView.addMoveToLocationListener(controlMoveToLocation);
    console.log('hello', article);
    map.addMarker(article);
};

const adjustForScreenSizeSmall = () => {


    const list = document.querySelector('.list') as HTMLElement;
    const map = document.querySelector('#map') as HTMLElement;

    list.after(map);
    list.hidden = true;

}

const adjustForScreenSizeLarge = () => {


    const list = document.querySelector('.list') as HTMLElement;
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    const map = document.querySelector('#map') as HTMLElement;

    sidebar.after(map);
    list.hidden = false;
}


const controlShowMap = () => {
    toggleHidden(document.querySelector('.list') as HTMLElement);
    toggleHidden(document.querySelector('.map') as HTMLElement);

    const btn = document.querySelector('.sidebar__btn--map') as HTMLElement;
    (document.querySelector('.fa-rectangle-list') as HTMLElement).classList.toggle('hidden');
    (document.querySelector('.fa-map') as HTMLElement).classList.toggle('hidden');


}

const toggleHidden = (element: HTMLElement) => {
    element.hidden = !element.hidden;
}

export const initialize = async () => {

    if (window.innerWidth < 860) {
        adjustForScreenSizeSmall();
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth < 1000) {
            adjustForScreenSizeSmall();
        }
        if (window.innerWidth >= 1000) {
            adjustForScreenSizeLarge();
        }
    });

    document.querySelector('.sidebar__map-btn')?.addEventListener('click', controlShowMap);

    model.loadLocalStorage();
    model.loadIcons();
    const currentPos = await model.getPosition();
    map.initMap(currentPos);
    map.addClickListener(controlShowForm);
    model.getArticles().forEach(article => displayArticle(article));
    map.closeAllPopups();

    document.querySelector('.sidebar__logo')?.addEventListener('click', controlShowAllArticles);
    document.querySelector('.sidebar__btn--category')?.addEventListener('click', controlShowCategories);
    document.querySelector('.sidebar__btn--sort')?.addEventListener('click', controlShowSortOptions);
    document.querySelector('.sidebar__search-bar')?.addEventListener('input', (e) => {
        listView.filter((e.target as HTMLInputElement).value);
    });



};