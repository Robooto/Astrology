const scraper = require('./scraper/scraper');
const horoscopeData = require('./static/horoscopeData.json');
const url = `https://www.freewillastrology.com/horoscopes/allsigns.html`;


scraper.getWebsiteHtml(url)
    .then(body => scraper.parseHoroscopeData(body))
    .then(scopes => scraper.addHoroscopes(scopes, horoscopeData))
    .then(data => console.log(data))
    .catch(err => console.error(err));
