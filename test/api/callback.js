'use strict';

var expect = require('chai').expect,
  supertest = require('supertest'),
  app = require('../../app');

describe('Callback', function() {
  it('should return a 302 response', function(done) {
    supertest(app)
      .get('/callback/slack')
      .set('x-access-token', global.accessToken)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('ok');
        expect(res.body.result).to.not.be.true;
        done();
      });
  });
});
