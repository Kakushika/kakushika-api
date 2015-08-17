'use strict';

var expect = require('chai').expect,
  supertest = require('supertest'),
  app = require('../../app');

describe('Login', function() {
  it('should return a not ok', function(done) {
    supertest(app)
      .post('/login')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('ok');
        expect(res.body.ok).not.to.be.true;
        done();
      });
  });

  it('should return a ok', function(done) {
    supertest(app)
      .post('/login')
      .send({
        'email': 'hoge@hoge.net',
        'password': 'hoge'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('ok');
        expect(res.body.ok).to.be.true;
        expect(res.body).to.have.property('token');
        expect(res.body.token).not.to.be.null;
        done();
      });
  });
});
