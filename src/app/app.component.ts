import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';

import { SwapiService } from './swapi.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(
        private api: SwapiService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    private search$ = new Subject<string>();

    routeParam$ = this.route.queryParams.pipe(
        filter((params) => {
            // ignore params if sent after navigate call of this component
            const nav = this.router.getCurrentNavigation();
            return params.search && (!nav || !nav.extras.state || !nav.extras.state.ownNavigate);
        }),
        map((params) => params.search)
    );

    results$ = merge(
        this.search$.pipe(
            debounceTime(500) // debounce text input search by 200ms
        ),
        this.routeParam$
    ).pipe(
        distinctUntilChanged(), // prevent same search few times in a row
        map((search) => search ?
            this.api.getPeople({search}) : undefined) // map to observable of 1st page of results
    );

    search(value: string) {
        this.search$.next(value);

        this.router.navigate([], {
            queryParams: {search: value},
            state: {
                ownNavigate: true
            }
        });
    }
}
