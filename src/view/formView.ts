import type { View } from './view';
import type { InputData, LocationData } from '../model/data-types';
import { RatingView } from './ratingView';

export class FormView implements View<LocationData> {

    private parent: Element;

    private data: LocationData;

    private ratingView: RatingView;

    constructor(parentElement: Element) {
        this.parent = parentElement;
        this.data = {};
        this.ratingView = new RatingView();
    }


    render(model: LocationData): void {
        this.data = model;
        this.clear();
        const markup = this.generateMarkup(model);
        this.parent.insertAdjacentHTML('afterbegin', markup);
        this.show();


        const switchBtn = (<HTMLButtonElement>this.parent.querySelector('.rating-switch'));
        switchBtn.nextElementSibling!.innerHTML = this.ratingView.render(3);
        this.ratingView.addSwitchListener(switchBtn);


    }

    clear(): void {
        this.parent.innerHTML = '';
    }

    hide(): void {
        this.parent.classList.add('hidden');
    }

    show(): void {
        this.parent.classList.remove('hidden');
    }

    update(model: LocationData): void {
    }

    addSaveListener(handler: () => void) {
        (<HTMLButtonElement>this.parent.querySelector('.form__btn--save')).addEventListener('click', handler);
    }

    addCancelListener(handler: () => void) {
        (<HTMLButtonElement>this.parent.querySelector('.form__btn--cancel')).addEventListener('click', handler);
    }


    generateMarkup(model: LocationData): string {
        return `
        <div class='form__container'>
            <div class='form__row'>
                <span class='form__icon--small'><i class='fa-solid fa-utensils'></i></span>
                <input class='form__input form__input--title' value='${model.title}' placeholder='Title'/>
            </div>
            <div class='form__row'>
                <span class='form__icon--small'><i class='fa-solid fa-location-dot'></i></span>
                <input class='form__input form__input--address' type='text' name='address' value='${model.address} ${model.houseNumber}' placeholder='Address'>
            </div>
            <div class='form__row'>
                <span class='form__icon--small'><i class='fa-solid fa-tags'></i></span>
                <span class='form__input form__textarea form__input--tags' id='description-input' role='textbox' contenteditable='true'>#</span>
            </div>
            <div class='form__row'>
                <span class='form__icon--small'><i class='fa-regular fa-note-sticky'></i></span>
                <span class='form__input form__textarea form__input--description' role='textbox' contenteditable='true'></span>
            </div>
            
            <div class='form__row'>
                <span class='form__icon--small'><i class='fa-solid fa-link'></i></span>
                <input class='form__input form__input--link' type='text' name='link' value='https://examplewebsite.com' placeholder='Website'>
            </div>
            <div class='form__group'>
                <div class='form__row'>
                    <span class='form__icon--small'><i class='fa-regular fa-calendar'></i></span>
                    <input class='form__input form__input--date' type='date' name='date' id='date' value='${model.date}' max='2222-12-31'>
                </div>
                <div class='form__row form__row--rating'>
                    <input class='form__input form__input--number rating-switch' type='number'  name='rating' min='0' max='5' step='0.5' value='3'>
                    <span class='edit--stars form__icon--small'></span>
                </div>
            </div>
            <div class='form__buttons'>
                <button class='form__btn form__btn--cancel' type='button'>Cancel</button>
                <button class='form__btn form__btn--save' type='button'>Save</button>
            </div>
        </div>
            `;
    }

    getFormValues(): InputData {
        const title: string = (<HTMLInputElement>document.querySelector('.form__input--title')).value;
        const address: string = (<HTMLInputElement>document.querySelector('.form__input--address')).value;
        const coordinates: number[] = this.data.coordinates ? this.data.coordinates : [0, 0];
        const tags: string[] = (<HTMLInputElement>document.querySelector('.form__input--tags')).innerHTML.split('#').filter(tag => tag !== '');
        const description: string = (<HTMLInputElement>document.querySelector('.form__input--description')).innerHTML;
        const date: string = (<HTMLInputElement>document.querySelector('.form__input--date')).value;
        const link: string = (<HTMLInputElement>document.querySelector('.form__input--link')).value;
        const rating: number = +(<HTMLInputElement>document.querySelector('.form__input--number')).value;
        return { title, address, coordinates, description, tags, date, link, rating };

    }

}