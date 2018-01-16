const scraper = require('./scraper');
const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require("chai-as-promised");
const cheerio = require('cheerio');
const request = require('request');
const staticData = require('../static/horoscopeData');

chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should();

describe('Scraper', () => {

    describe('parseDate', () => {
        it('should parse date from a string', () => {
            let stringDate = 'Horoscopes for week of January 11, 2018';
            expect(scraper.parseDate(stringDate)).to.deep.equal(new Date('January 11, 2018'));
        });
    });

    describe('getTextDate', () => {
        it('should get the first line from an array', () => {
            let stringDate = 'Horoscopes for week of January 11, 2018 \n testing \n \n';
            expect(scraper.getTextDate(stringDate)).to.equal('Horoscopes for week of January 11, 2018');
        });
    });

    describe('cleanUpFirst', () => {
        it('should remove the first line and remove new lines', () => {
            let stringDate = 'Horoscopes for week of January 11, 2018 \n testing \n \n';
            expect(scraper.cleanUpFirst(stringDate)).to.equal('testing');
        });
    });

    describe('getWebsiteHtml', function () {
        afterEach(function () {
            request.get.restore();
        });
        it('should reject if promise fails', () => {
            sinon.stub(request, 'get').yields('error', null, null);
            const url = `https://www.freewillastrology.com/horoscopes/allsigns.html`;
            return expect(scraper.getWebsiteHtml(url)).to.be.rejected;
        });

        it('should fufil if the request returns anything', () => {
            sinon.stub(request, 'get').yields(null, null, `<body></body>`);
            const url = `https://www.freewillastrology.com/horoscopes/allsigns.html`;
            return expect(scraper.getWebsiteHtml(url)).to.be.fulfilled;
        })
    });

    describe('parseHoroscopeData', function () {
        it('should reject if there is no dom elements', () => {
            return expect(scraper.parseHoroscopeData('<html></html>')).to.be.rejected;
        });

        it('should return parsed data', () => {
            return expect(scraper.parseHoroscopeData(`<body><div><table></table><table><tbody><tr><td></td><td><div>test*pastcl\nasdf</div></td></tr><tr><td></td><td><div>test*pastcl\nasdf</div></td></tr></tbody></table></div></body>`)).to.be.fulfilled;
        });
    });

    describe('addHoroscopes', function () {
        it('should reject if there is no parsed info', () => {
            return expect(scraper.addHoroscopes(null, staticData)).to.be.rejected;
        });

        it('should fulfill if there is parsed info', () => {
            return expect(scraper.addHoroscopes({
                textDate: 'Horoscopes for week of January 11, 2018',
                date: '2018-01-11T08:00:00.000Z',
                horoscopes: [
                    {
                        "name": "Aries",
                        "dateRange": "March 21 - April 19",
                        "lowDate": "2018-03-21T07:00:00.000Z",
                        "highDate": "2018-04-19T07:00:00.000Z"
                    }]
            }, staticData)).to.eventually.have.property("date");
        });
    });
});