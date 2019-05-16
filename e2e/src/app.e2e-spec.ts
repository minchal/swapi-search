import { browser, logging } from 'protractor';
import { AppPage } from './app.po';

describe('App', () => {
    const app = new AppPage();

    beforeEach(() => {
        app.navigateTo();
    });

    it('should display empty results', () => {
        expect(app.getResultsCount()).toBe(0);
        expect(app.summary.isPresent()).toBeFalsy();
    });

    it('should display single result', () => {
        app.input.sendKeys('luke');

        expect(app.getResultsCount()).toBe(1);
        expect(app.getSummaryNumber()).toBe('1');

        const luke = app.getPerson();
        expect(luke.getName()).toBe('Luke Skywalker');
        expect(luke.getFilmsCount()).toBeGreaterThan(2);
    });

    it('should display results', () => {
        app.input.sendKeys('b');

        // expect first page of results
        expect(app.getResultsCount()).toBe(10);
        expect(app.getSummaryNumber()).toBe('19');

        // load 2nd page
        app.scrollToEnd();

        expect(app.getResultsCount()).toBe(19);

        // do not load more
        app.scrollToEnd();

        expect(app.getResultsCount()).toBe(19);
    });

    it('should load results from URL', () => {
        app.navigateTo('luke');

        expect(app.input.getAttribute('value')).toBe('luke');
        expect(app.getResultsCount()).toBe(1);
        expect(app.getSummaryNumber()).toBe('1');
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
