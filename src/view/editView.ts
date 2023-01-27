import { RatingView } from './ratingView';
import type { Article } from '../model/article';
import type { View } from './view';
import type { Icon } from '../model/icon';
import type { InputData } from '../model/data-types';

export class EditView implements View<Article> {

    private parent: HTMLElement;
    private originalElement!: HTMLElement;
    private ratingView;

    private data!: Article;

    constructor(parent: HTMLElement) {
        this.parent = parent;
        this.ratingView = new RatingView();
    }



    render(model: Article): void {
        this.data = model;
        this.originalElement.hidden = true;
        const markup = this.generateMarkup(model);
        this.originalElement.insertAdjacentHTML('afterend', markup);

        const switchBtn = (<HTMLButtonElement>this.parent.querySelector('.rating-switch'));
        this.ratingView.addSwitchListener(switchBtn);

        document.querySelector('.btn--cancel')!.addEventListener('click', () => {
            document.querySelector('.form--edit')!.remove();
            this.originalElement.hidden = false;
        });

        setTimeout(() => {
            (<HTMLElement>this.parent.querySelector(".form--edit")).classList.add('form__anim--active');
        }, 100);
    }

    setOriginalElement(elem: HTMLElement): void {
        this.originalElement = elem;
    }

    update(model: Article): void {
    }

    updateIcon(icon: Icon): void {
        (<HTMLImageElement>document.querySelector('.article__icon--edit')).src = icon.url;
        (<HTMLImageElement>document.querySelector('.article__icon--edit')).setAttribute('data-id', `${icon.id}`);
        console.log(icon.url);
    }

    clear(): void {
    }

    addConfirmListener(handler: () => void ) {
        (<HTMLButtonElement> this.parent.querySelector('.btn--confirm')).addEventListener('click', (e) => {
            handler();
            document.querySelector('.form--edit')!.remove();
            this.originalElement.hidden = false;
        });
    }

    addIconMenuListener(handler: () => void) {
        (<HTMLButtonElement> this.parent.querySelector(".icon-selector")).addEventListener('click', handler);
    }

    generateMarkup(model: Article): string {
        return `
            <form class='article form form--edit'>
                <div class='article__box article__box--main icon-selector--anchor'>
                    <div class='article__icon form__icon icon-selector'>
                        <img class='article__icon--edit article__icon--img' src='${model.icon.url}' alt='icon' data-id='${model.icon.id}'>
                        <div class='form__icon--overlay'><i class='fa-solid fa-edit'></i></div>
                    </div>
                    <div class='article__details'>
                        <input class='form__input form__input--title' type='text' name='name'  value='${model.title}' placeholder='Title'>
                    </div>
                    <div class='article__details'>
                      <input class='form__input form__input--number rating-switch' type='number'  name='rating' min='0' max='5' step='0.5' value='${model.rating}'>
                      <span class='edit--stars'>${this.ratingView.render(model.rating)}</span>
                    </div>
                    <div class='article__details'>
                      <input class='form__input form__input--address' type='text'  name='address' value='${model.address}' placeholder='Address'>
                    </div>
                    
                    <div class='article__details'>
                      <span><i class='fa-solid fa-location-dot'></i></span>
                      <span class='form__input--distance'>${model.distance}</span>
                      
                    </div>
                    
                </div>
                <div class='article__box article__box--info '> 
                    <div class='article__details'>
                        <span><i class='fa-solid fa-link'></i></span>
                        <input class='form__input form__input--link' type='text' name='link' value='${model.link}' placeholder='Website'>
                    </div>
                    <div class='article__details'>
                        <span><i class='fa-regular fa-calendar'></i></span>
                        <input class='form__input form__input--date' type='date' name='date' id='date'  value='${model.date}' max='2222-12-31'>
                    </div>
                    <div class='article__details article__tags'>
                        <span><i class='fa-solid fa-tags'></i></span>
                        <span class='form__input form__textarea form__input--tags' role='textbox' contenteditable='true'>${model.tags.map(tag => `#${tag}`).join('')}</span>
                    </div>
                    <div class='article__details article__notes'>
                        <span><i class='fa-regular fa-note-sticky'></i></span>
                        <span class='form__input form__textarea form__input--description' role='textbox' contenteditable='true'>${model.description}</span>
                    </div>
                </div>
                
                <div class='article__box form__buttons'>
                    <button class='form__btn btn--cancel' type='button'><i class='fa-solid fa-xmark'></i><span>Cancel</span></button>
                    <button class='form__btn btn--confirm' type='button'><i class='fa-solid fa-check'></i><span>Confirm</span></button>
                </div>
            </form>
        `
    }

    getEditValues(): InputData {
        const title: string = (<HTMLInputElement>document.querySelector('.form__input--title')).value;
        const address: string = (<HTMLInputElement>document.querySelector('.form__input--address')).value;
        const coordinates: number[] = this.data.coordinates ? this.data.coordinates : [0, 0];
        const tags: string[] = (<HTMLInputElement>document.querySelector('.form__input--tags')).innerHTML.split('#').filter(tag => tag !== '');
        const description: string = (<HTMLInputElement>document.querySelector('.form__input--description')).innerHTML;
        const date: string = (<HTMLInputElement>document.querySelector('.form__input--date')).value;
        const link: string = (<HTMLInputElement>document.querySelector('.form__input--link')).value;
        const rating: number = +(<HTMLInputElement>document.querySelector('.form__input--number')).value;
        const iconId: number = +(<HTMLImageElement>document.querySelector('.article__icon--edit')).dataset.id!;
        const id = this.data.id;
        return { title, address, coordinates, description, tags, date, link, rating, iconId, id};

    }

}