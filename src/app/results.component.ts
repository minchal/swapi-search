import { Component, Input, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { Person, Page } from './swapi.service';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html'
})
export class ResultsComponent {
    @Input()
    set firstPage(page: Observable<Page<Person>>) {
        this.pages = [];

        if (page) {
            this.addPage(page);
        }
    }

    pages: Observable<Page<Person>>[];

    private addInProgress = false;

    @HostListener('window:scroll', ['$event'])
    bodyScroll(event: MouseEvent) {
        if (!this.pages.length || this.addInProgress) {
            return;
        }

        const html = (event.target as Document).documentElement;

        if (html.offsetHeight - (html.scrollTop + html.clientHeight) <= 0) {
            // prevent double loading of same page
            this.addInProgress = true;

            // load next page when last is loaded and has next
            this.pages[this.pages.length - 1].subscribe((page) => {
                if (page.next$) {
                    this.addPage(page.next$);
                }

                this.addInProgress = false;
            });
        }
    }

    private addPage(page: Observable<Page<Person>>) {
        this.pages.push(
            page.pipe(shareReplay(1))
        );
    }
}
