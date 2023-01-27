export interface View<T> {


    render(model: T): void;
    generateMarkup(model: T): string;

    update(model: T): void;

    clear(): void;

}