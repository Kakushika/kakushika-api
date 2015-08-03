'use strict';

var expect = require('chai').expect,
  supertest = require('supertest'),
  app = require('../app');

describe('Auth', function() {
  it('should return a 302 response', function(done) {
    supertest(app)
      .get('/auth/slack')
      .expect(302)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.header).to.have.property('location');
        expect(res.header.location).not.to.be.null;
        done();
      });
  });
});
