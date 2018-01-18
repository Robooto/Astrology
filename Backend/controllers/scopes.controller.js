const express = require('express');
const router = express.Router();
const scraper = require('../scraper/scraper');
const horoscopeData = require('../static/horoscopeData.json');



class ScopesController {

    constructor(router) {
        this.router = router;
        this.init();
    }

    init() {
        this.router.get('/', this.getScopes.bind(this));
    }

    async getScopes(req, res) {
        const url = `https://www.freewillastrology.com/horoscopes/allsigns.html`;
        let body = await scraper
            .getWebsiteHtml(url)
            .catch(err => this.handleError(err, res));
        let scopes = await scraper
            .parseHoroscopeData(body)
            .catch(err => this.handleError(err, res));
        let data = await scraper
            .addHoroscopes(scopes, horoscopeData)
            .catch(err => this.handleError(err, res));
        return res.send(data);
    }

    handleError(err, res) {
        console.error(err);
        res.status(500).send({ error: err });
    }
}

const scopes = new ScopesController(router);
module.exports = scopes.router;