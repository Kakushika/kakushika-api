'use strict';

var expect = require('chai').expect,
  supertest = require('supertest'),
  app = require('../../app');

describe('Callback', function() {
  it('should return a not ok', function(done) {
    supertest(app)
      .get('/callback/slack')
      .set('x-access-token', global.accessToken)
      .expect(400)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('ok');
        expect(res.body.ok).to.not.be.true;
        done();
      });
  });
});
