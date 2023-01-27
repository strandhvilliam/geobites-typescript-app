import type { View } from './view';
import type { Icon } from '../model/icon';


export class IconView implements View<Icon[]> {

    private parent: HTMLElement;


    constructor(parent: HTMLElement) {
        this.parent = parent;
    }


    render(model: Icon[]): void {
        const markup = this.generateMarkup(model);
        if (document.querySelector('.icon__menu')) {
            document.querySelector('.icon__menu')?.classList.remove('icon__menu--open');
        }
        this.parent.insertAdjacentHTML('afterbegin', markup);

        this.parent.querySelector('.icon__close')?.addEventListener('click', this.clear.bind(this));

        setTimeout(() => {
            this.parent.querySelector('.icon__menu')?.classList.add('icon__menu--open');
        }, 100);
    }

    generateMarkup(model: Icon[]): string {
        return `
            <div class="icon__menu">
                <button type="button" class="icon__close btn"><i class="fa-solid fa-times"></i></button>
                ${model.map(item => {
                    return `          
                        <button type="button" class="icon__item btn" title="${item.title}" data-id="${item.id}">
                            <img src="${item.url}" alt="${item.title}" class="icon__image" ">
                        </button>`
                }).join('')}
            </div>
            `;
    }

    clear(): void {
        setTimeout(() => {
            document.querySelector('.icon__menu')?.remove();
        }, 100);
        document.querySelector('.icon__menu')?.classList.remove('icon__menu--open');
    }

    update(model: Icon[]): void {
    }


    addClickListener (handler: (e: Event) => void) {
        this.parent.querySelectorAll(".icon__item")
            .forEach(item => item.addEventListener('click', handler));
    }

}