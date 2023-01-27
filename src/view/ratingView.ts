import type { View } from './view';

export class RatingView implements View<number> {


    render(rating: number) {
        return this._generateMarkup(rating);
    }

    addSwitchListener(switchBtn: HTMLButtonElement) {
        switchBtn.addEventListener('change', () => {
            const rating = switchBtn.value;
            switchBtn.nextElementSibling!.innerHTML = this.render(+rating);
        });
    }

    _generateMarkup(rating: number) {
        const ratingArray = (Math.round(rating * 2) / 2).toFixed(1).split('.');
        const fullStars = +ratingArray[0];
        const halfStars = ratingArray[1] === '5' ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;
        let markup = '<span class="rating-stars">';
        for (let i = 0; i < fullStars; i++) {
            markup += `<i class="fa-solid fa-star"></i>`
        }
        for (let i = 0; i < halfStars; i++) {
            markup += `<i class="fa-regular fa-star-half-stroke"></i>`
        }
        for (let i = 0; i < emptyStars; i++) {
            markup += `<i class="fa-regular fa-star"></i>`
        }
        markup += '</span>';
        return markup;
    }

    clear(): void {
    }

    generateMarkup(model: number): string {
        return '';
    }

    update(model: number): void {
    }
}