import type { View } from './view';
import type { Article } from '../model/article';
import { RatingView } from './ratingView';

export class ListView implements View<Article> {
    private parent: HTMLElement;
    private data: Article[];

    private ratingView: RatingView;

    constructor(parent: HTMLElement) {
        this.parent = parent;
        this.data = [];
        this.ratingView = new RatingView();
    }

    render(model: Article) {
        this.data.push(model);
        const markup = this.generateMarkup(model);
        // this.clear();
        this.parent.insertAdjacentHTML('afterbegin', markup);

        (<HTMLButtonElement>document.querySelector('.btn--show')).addEventListener('click', this.toggleInfo);

        if (window.innerWidth < 1000) {
            document.querySelectorAll('.article__item').forEach(el => {
                el.addEventListener('click', (e : Event) => {
                    this.toggleInfo(e)
                });
            });

        }
    }

    generateMarkup(model: Article): string {
        return `
            <li class='article article__item' data-id='${model.id}'>
                <div class='article__box article__buttons'>
                    <button class='btn btn--edit hidden'><i class='fa-solid fa-edit'></i></button>
                    <button class='btn btn--delete hidden'><i class='fa-solid fa-trash'></i></button>
                    <button class='btn btn--show'><i class='fa-solid fa-chevron-down'></i></button>
                </div>
                <div class='article__box article__box--main'>
                    <div class='article__icon'>
                        <img src='${model.icon.url}' alt='icon' class='article__icon--img'>
                    </div>
                    <div class='article__details'>
                        <h2 class='article__title'>${model.title}</h2>
                    </div>
                    <div class='article__details'>
                      <span>${model.rating}</span>
                      <span class='article__ratings'>${this.ratingView.render(model.rating)}</span>
                    </div>
                    <div class='article__details'>
                      <span class='article__address'>${model.address}</span>
                    </div>
                    
                    <div class='article__details '>
                      <span ><i class='fa-solid fa-location-dot'></i></span>
                      <span class='article__distance'>${model.distance} km</span>
                      <!--TODO: Ska räkna ut avstånd i m eller km beroende på nuvarande position-->
                      
                    </div>
                    
                </div>
                <div class='article__box article__box--info hidden'> 
                    <div class='article__details article__link'>
                        <span><i class='fa-solid fa-link'></i></i></span>
                        <span>${model.link}</i></span>
                    </div>
                    <div class='article__details '>
                        <span><i class='fa-regular fa-calendar'></i></span>
                        <span class='article__calendar'>${model.date}</i></span>
                    </div>
                    <div class='article__details article__tags'>
                        <span class='article__tags--content'><i class='fa-solid fa-tags'></i></span>
                        ${model.tags.map(tag => this.generateTag(tag)).join('&nbsp&nbsp')}
                    </div>
                    <div class='article__details article__notes'>
                        <span><i class='fa-regular fa-note-sticky'></i></i></span>
                        <span>${model.description}</i></span>
                    </div>
                </div>
            </li>
            `;

    }

    generateTag(tag: string) {
        return `<span class="article__tag">#${tag}</span>`
    }

    clear() {
        this.data = [];
        this.parent.querySelectorAll('.article').forEach(el => el.remove());
    }

    update(model: Article): void {
        const markup = this.generateMarkup(model);
        const originalArticle = this.parent.querySelector(`.article__item[data-id="${model.id}"]`);
        if (originalArticle) {
            originalArticle.insertAdjacentHTML('afterend', markup);
            originalArticle.remove();
        }
        const editedArticle = this.parent.querySelector(`.article__item[data-id="${model.id}"]`);
        editedArticle?.querySelector('.btn--show')?.addEventListener('click', this.toggleInfo);

    }

    delete(id: number): void {
        const article = this.parent.querySelector(`.article__item[data-id="${id}"]`);
        if (article) article.remove();
    }

    addEditListener(handler: EventListener) {
        document.querySelectorAll('.btn--edit')
            .forEach(btn => btn.addEventListener('click', handler));
    }

    addDeleteListener(handler: EventListener) {
        document.querySelectorAll('.btn--delete')
            .forEach(btn => btn.addEventListener('click', handler));
    }

    addMoveToLocationListener(handler: EventListener) {
        document.querySelectorAll('.article')
            .forEach(btn => btn.addEventListener('click', handler));
    }

    filter(input: string) {
        const articles = document.querySelectorAll('.article');

        articles.forEach(article => {
            if (article.querySelector('.article__title')?.innerHTML.toLowerCase().includes(input.toLowerCase())) {
                article.classList.remove('search_hidden');
            } else if (article.querySelector('.article__address')?.innerHTML.toLowerCase().includes(input.toLowerCase())) {
                article.classList.remove('search_hidden');
            } else if (article.querySelector('.article__tags--content')?.innerHTML.toLowerCase().includes(input.toLowerCase())) {
                article.classList.remove('search_hidden');
            } else {
                article.classList.add('search_hidden');
            }
        })
    }

    toggleInfo(e: Event) {
        const article: HTMLElement = (<HTMLButtonElement>e.target).closest('.article')!;
        const info = article.querySelector('.article__box--info')!;
        info.classList.toggle('hidden');
        const btn = article.querySelector('.btn--show')!;
        btn.querySelector('i')!.classList.toggle('fa-chevron-down');
        btn.querySelector('i')!.classList.toggle('fa-chevron-up');
        article.querySelector('.btn--edit')!.classList.toggle('hidden');
        article.querySelector('.btn--delete')!.classList.toggle('hidden');

    }

}