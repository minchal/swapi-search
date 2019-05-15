import { Component, Input } from '@angular/core';

import { Person } from './swapi.service';

@Component({
    selector: 'app-person',
    templateUrl: './person.component.html'
})
export class PersonComponent {
    @Input() data: Person;
}
