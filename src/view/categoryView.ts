import type { View } from './view';
import type { Icon } from '../model/icon';

export class CategoryView implements View<Icon[]> {

    private parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.parent = parent;
    }

    render(model: Icon[]): void {
        this.clear();
        const markup = this.generateMarkup(model);
        this.parent.insertAdjacentHTML('afterbegin', markup);
    }

    generateMarkup(model: Icon[]): string {
        return model.map((icon) => {
            return `
                <li class=" category__item btn " data-id="${icon.id}">
                    <img src="${icon.url}" alt="${icon.title}" class="category__img">
                    <h3 class="category__title">${icon.title}</h3>
                </li>`
        }).join('');
    }

    update(model: Icon[]): void {
    }

    clear(): void {
        this.parent.innerHTML = '';
    }

    hide(): void {
        this.parent.classList.add('hidden');
    }

    addCategoryClickListener (handler: (e: Event) => void) {
        this.parent.querySelectorAll(".category__item")
            .forEach(item => item.addEventListener('click', handler));
    }



}