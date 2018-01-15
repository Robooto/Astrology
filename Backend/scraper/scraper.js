const request = require('request');
const cheerio = require('cheerio');

/** Return body for website  */
const getWebsiteHtml = (url) => {
    return new Promise((resolve, reject) => {
        request.get(url, (err, resp, body) => {
            if(err) {
                return reject({
                    error: err
                });
            }
            return resolve(body);
        });
    });
};

/** Get horoscope data from the website */
const parseHoroscopeData = (body) => {
    return new Promise((resolve, reject) => {
        let $ = cheerio.load(body);
        let horoscopesElems = $('body > div > table:nth-child(2) > tbody > tr > td:nth-child(2)');
        if(!horoscopesElems) {
            return reject({
                error: 'No elements found'
            });
        }
        let horoscopes = [];
        $(horoscopesElems).each(function(index, elem) {
            horoscopes.push($(this).text().trim().split('*')[0]);
        });
    
        // remove the last item in the list
        horoscopes.pop();
    
        // do some work to first thing on this list to get rid of the date
        let textDate = getTextDate(horoscopes[0]);
        let date = parseDate(textDate);
        horoscopes[0] = cleanUpFirst(horoscopes[0]);
    
        // remove new lines from text
        horoscopes = horoscopes.map(item => item.replace(/(\r\n|\n|\r)/gm,"").trim());
        return resolve({
            textDate,
            date,
            horoscopes
        });
    });
};

/** Add horoscope meta data to the horoscope */
const addHoroscopes = (parsedInfo, staticData) => {
    return new Promise((resolve, error) => {
        if (!parsedInfo || !parsedInfo.horoscopes){
            return error({
                error: err
            });
        }
        let scopes = staticData.horoscopes.map((item, i) => {
            return {
                ...item,
                text: parsedInfo.horoscopes[i]
            };
        });
        return resolve({...parsedInfo, horoscopes: scopes});
    });
};

/** Get date from the text string */
function parseDate(text) {
    let of = 'of';
    return new Date(text.slice(text.indexOf(of) + of.length));
}

/** Get Text line  */
function getTextDate(text) {
    let textArr = text.split('\n');
    return textArr[0].trim();
}

/** Remove new lines and the first sentance */
function cleanUpFirst(text) {
    let textArr = text.split('\n');
    // remove date 
    textArr.shift();
    return textArr.join('').trim();
}

module.exports = {
    getWebsiteHtml,
    parseHoroscopeData,
    addHoroscopes,
    parseDate,
    getTextDate,
    cleanUpFirst
}