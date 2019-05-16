import { browser, $ } from 'protractor';

import { PersonPage } from './person.po';

export class AppPage {
    container = $('app-root');

    input = this.container.$('input');
    summary = this.container.$('p.text-muted');
    results = this.container.$$('app-person');

    navigateTo(search?: string) {
        return browser.get(browser.baseUrl + (search ? `?search=${search}` : ''));
    }

    scrollToEnd() {
        return browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    }

    getResultsCount() {
        return this.results.count();
    }

    getSummaryNumber() {
        return this.summary.$('strong').getText();
    }

    getPerson(i: number = 0) {
        return new PersonPage(this.results.get(i));
    }
}
