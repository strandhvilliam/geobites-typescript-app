import type { View } from './view';

export class SortView implements View<string[]> {
    private parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.parent = parent;
    }

    render(model: string[]): void {
        this.clear();
        const markup = this.generateMarkup(model);
        this.parent.insertAdjacentHTML('afterbegin', markup);
    }

    clear(): void {
        this.parent.innerHTML = '';    }

    hide(): void {
        this.parent.classList.add('hidden');
    }

    update(model: string[]): void {
    }

    generateMarkup(model: string[]): string {

        return model.map((item: string) => {
            return `
                <li class="sort__option btn " data-sort="${item}">
                    <h3 class="sort__title">${item}</h3>
                </li>`
        }).join('');

    }

    addClickListener(handler: (e: Event) => void) {
        this.parent.querySelectorAll('.sort__option')
            .forEach(item => item.addEventListener('click', handler));
    }

}