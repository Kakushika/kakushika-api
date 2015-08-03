'use strict';

var expect = require('chai').expect,
  supertest = require('supertest'),
  app = require('../app');

describe('Index', function() {
  it('should return a 200 response', function(done) {
    supertest(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('ok');
        expect(res.body.result).to.be.true;
        done();
      });
  });
});
