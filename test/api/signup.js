'use strict';

var expect = require('chai').expect,
  supertest = require('supertest'),
  app = require('../../app');

describe('Signup', function() {
  it('should return a 200 response', function(done) {
    supertest(app)
      .post('/signup')
      .expect(400)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('ok');
        expect(res.body.ok).to.not.be.true;
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should return a 201 response', function(done) {
    supertest(app)
      .post('/signup')
      .send({
        'email': 'hoge2@hoge.net',
        'password': 'hoge'
      })
      .expect(201)
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
