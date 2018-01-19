let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('Scopes Controller', () => {

    describe('/Get Scopes', () => {
        it('it should GET all the horoscopes', (done) => {
            chai.request(server)
                .get('/scopes')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('horoscopes').length.above(2);
                    done();
                });
        });
    });

    describe('/Get Scope', () => {
        it('it should GET the horoscope for the name passed in', (done) => {
            chai.request(server)
                .get('/scopes/aries')
                .end((err, res) => {
                    //console.log(res);
                    expect(res).to.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('horoscopes').length(1);
                    done();
                });
        });
    });
});