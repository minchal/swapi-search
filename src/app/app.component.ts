import { Component, HostListener } from '@angular/core';

import { SwapiService } from './swapi.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(
        private api: SwapiService
    ) {}

    results$ = this.api.getPeople();

    @HostListener('window:scroll', ['$event'])
    bodyScroll(event: MouseEvent) {
        // console.log(event);
    }
}
