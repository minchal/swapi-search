import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

/**
 * The Star Wars API [https://swapi.co/] wrapper for selected endpoints.
 *
 * This whole service and refrences types could be extended for more generic usages of SWAPI.
 */
@Injectable({
    providedIn: 'root'
})
export class SwapiService {
    constructor(
        private http: HttpClient,
    ) {}

    private baseUrl = 'https://swapi.co/api';
    private cache: {[uri: string]: Observable<any>} = {};

    /**
     * Get (optionally filtered) paginated list of people.
     */
    getPeople({search}: {search?: string} = {}) {
        return this.resolvePage<Person>(`${this.baseUrl}/people/`, {search: search || ''});
    }

    /**
     * Get Film object identified by URI.
     */
    getFilm(uri: string) {
        return this.resolve<Film>(uri);
    }

    /**
     * Get page of resources with links for next and previous pages.
     */
    resolvePage<T>(uri: string, params?: any) {
        return this.http
            .get<any>(uri, {params})
            .pipe(map((response) => {
                return new Page<T>(
                    this,
                    response.count,
                    response.results,
                    response.next,
                    response.previous,
                );
            }));
    }

    /**
     * Get and cache single object identified by URI.
     */
    resolve<T>(uri: string) {
        if (!this.cache[uri]) {
            this.cache[uri] = this.http
                .get<T>(uri)
                .pipe(shareReplay(1));
        }

        return this.cache[uri] as Observable<T>;
    }
}

/**
 * Page of resources definiton
 */
export class Page<T> {
    constructor(
        private api: SwapiService,
        public readonly count: number,
        public readonly results: T[],
        public readonly next?: string,
        public readonly previous?: string,
    ) {}

    readonly next$     = this.next     ? this.api.resolvePage<T>(this.next) : undefined;
    readonly previous$ = this.previous ? this.api.resolvePage<T>(this.previous) : undefined;
}

/**
 * Define (and use in the app) only selected attributes.
 */
export interface Person {
    name: string;
    birth_year: string;
    eye_color: string;
    gender: string;
    hair_color: string;
    height: string;
    mass: string;
    skin_color: string;
    films: string[];
}

/**
 * Define (and use in the app) only selected attributes.
 */
export interface Film {
    title: string;
    release_date: string;
}
