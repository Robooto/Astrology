let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe.only('Scopes Controller', () => {

    describe('/Get Scopes', () => {
        it('it should GET all the horoscopes', (done) => {
            chai.request(server)
                .get('/scopes')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('horoscopes');
                });
            done();
        });
    });
});