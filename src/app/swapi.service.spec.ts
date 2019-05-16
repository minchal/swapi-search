import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SwapiService } from './swapi.service';

describe('SwapiService', () => {
    let httpTC: HttpTestingController;
    let swapi: SwapiService;

    const peopleResults = [{
        name: 'Test Person',
        birth_year: '2019',
        eye_color: 'black',
        gender: 'm',
        hair_color: 'black',
        height: '22',
        mass: '11',
        skin_color: 'black',
        films: [],
    }];

    const filmResult = {
        title: 'Test Film',
        release_date: '2019',
    };

    const filmResult2 = {
        title: 'Test Film 2',
        release_date: '2019',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule, ],
            providers: [ SwapiService, ],
        });

        httpTC = TestBed.get(HttpTestingController);
        swapi = TestBed.get(SwapiService);
    });

    afterEach(() => {
        httpTC.verify();
    });

    it('should get simple all people list', () => {
        swapi.getPeople().subscribe((data) => {
            expect(data.count).toEqual(1);
            expect(data.results).toEqual(peopleResults);

            expect(data.next).toBeUndefined();
            expect(data.next$).toBeUndefined();
            expect(data.previous).toBeUndefined();
            expect(data.previous$).toBeUndefined();
        });

        const req = httpTC.expectOne('https://swapi.co/api/people/');

        expect(req.request.method).toEqual('GET');

        req.flush({
            count: 1,
            results: peopleResults
        });

        httpTC.verify();
    });

    it('should get people list with links', () => {
        swapi.getPeople().subscribe((data) => {
            expect(data.count).toEqual(1);
            expect(data.results).toEqual(peopleResults);

            expect(data.next).toBe('http://next');
            expect(data.next$).toBeTruthy();
            expect(data.previous).toBe('http://prev');
            expect(data.previous$).toBeTruthy();
        });

        const req = httpTC.expectOne('https://swapi.co/api/people/');

        expect(req.request.method).toEqual('GET');

        req.flush({
            count: 1,
            results: peopleResults,
            next: 'http://next',
            previous: 'http://prev'
        });

        httpTC.verify();
    });

    it('should get same film only once', () => {
        const uri1 = 'https://film-1';
        const uri2 = 'https://film-2';

        swapi.getFilm(uri1).subscribe((data) => {
            expect(data).toEqual(filmResult);
        });

        swapi.getFilm(uri1).subscribe((data) => {
            expect(data).toEqual(filmResult);
        });

        const req1 = httpTC.expectOne(uri1);

        expect(req1.request.method).toEqual('GET');

        req1.flush(filmResult);
        httpTC.verify();

        swapi.getFilm(uri2).subscribe((data) => {
            expect(data).toEqual(filmResult2);
        });

        const req2 = httpTC.expectOne(uri2);
        req2.flush(filmResult2);
        httpTC.verify();
    });
});
