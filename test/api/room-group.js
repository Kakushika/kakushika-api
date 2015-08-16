'use strict';

var expect = require('chai').expect,
  supertest = require('supertest'),
  app = require('../../app');

describe('RoomGroup', function() {
  it('should return a 200 response', function(done) {
    supertest(app)
      .get('/room-group')
      .set('x-access-token', global.accessToken)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('ok');
        expect(res.body.result).to.not.be.true;
        expect(res.body).to.have.property('roomGroup');
        done();
      });
  });
});
