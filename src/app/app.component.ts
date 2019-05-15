import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { SwapiService } from './swapi.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(
        private api: SwapiService
    ) {}

    private search$ = new Subject<string>();

    results$ = this.search$
        .pipe(
            distinctUntilChanged(), // prevent same search few times in a row
            filter((search) => search && search.length >= 1), // start searching from 1 letter
            debounceTime(200), // debounce search by 200ms
            map((search) => this.api.getPeople({search})) // map to observable of 1st page of results
        );

    search(value: string) {
        this.search$.next(value);
    }
}
