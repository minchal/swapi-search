export class PersonPage {
    constructor(
        public container
    ) {}

    films = this.container.$$('.list-group-item');

    getName() {
        return this.container.$('h4').getText();
    }

    getFilmsCount() {
        return this.films.count();
    }
}
