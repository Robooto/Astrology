const express = require('express');
const router = express.Router();
const scraper = require('../scraper/scraper');
const horoscopeData = require('../static/horoscopeData.json');


/** Scopes Controller */
class ScopesController {

    constructor(router) {
        this.router = router;
        this.init();
    }

    init() {
        this.router.get('/', this.getScopes.bind(this));
        this.router.get('/:sign', this.getScopeByName.bind(this));
    }

    /** get scope data */
    getScopeData() {
        return new Promise((resolve, reject) => {
            const url = `https://www.freewillastrology.com/horoscopes/allsigns.html`;
            scraper.getWebsiteHtml(url)
                .then(body => scraper.parseHoroscopeData(body))
                .then(scopes => scraper.addHoroscopes(scopes, horoscopeData))
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    async getScopes(req, res) {
        let data = await this.getScopeData()
            .catch(err => this.handleError(err, res));
        return res.send(data);
    }

    async getScopeByName(req, res) {
        let sign = req.params.sign;
        let data = await this.getScopeData()
            .catch(err => this.handleError(err, res));

        data.horoscopes = data.horoscopes.filter(i => i.sign.toLocaleLowerCase() === sign.toLocaleLowerCase());
        return res.send(data);
    }

    handleError(err, res) {
        console.error(err);
        res.status(500).send({ error: err });
    }
}

const scopes = new ScopesController(router);
module.exports = scopes.router;