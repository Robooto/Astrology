const scraper = require('./scraper');
const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require("chai-as-promised");
const cheerio = require('cheerio');
const request = require('request');
const staticData = require('../static/horoscopeData');
 
chai.use(chaiAsPromised);
const expect = chai.expect;

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

    describe('getWebsiteHtml', function() {
        after(function () {
            request.get.restore();
        });
        it('should reject if promise fails', () => {
            sinon.stub(request, 'get').returns('error', null, null);
            const url = `https://www.freewillastrology.com/horoscopes/allsigns.html`;
            expect(scraper.getWebsiteHtml(url)).to.be.rejected;
        });
    });

    describe('parseHoroscopeData', function() {
        it('should reject if there is no dom elements', () => {         
            expect(scraper.parseHoroscopeData('<html></html>')).to.be.rejected;
        });
    });

    describe('addHoroscopes', function() {
        it('should reject if there is no parsed info', () => {
            expect(scraper.addHoroscopes(null, staticData)).to.be.rejected;
        });
    });
});