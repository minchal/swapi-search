import { Component, Input, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';

import { Person, SwapiService, Film } from './swapi.service';

@Component({
    selector: 'app-person',
    templateUrl: './person.component.html',
})
export class PersonComponent {
    constructor(
        private api: SwapiService
    ) {}

    @HostBinding('class') cssClass = 'card';

    @Input()
    set person(data: Person) {
        this.data = data;
        this.films = data.films.map((film) => this.api.getFilm(film));
    }

    data: Person;
    films: Observable<Film>[];
}
