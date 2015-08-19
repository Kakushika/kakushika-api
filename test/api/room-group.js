'use strict';

var expect = require('chai').expect,
  supertest = require('supertest'),
  app = require('../../app');

describe('RoomGroup', function() {
  it('should return a ok', function(done) {
    supertest(app)
      .get('/room-group')
      .set('x-access-token', global.accessToken)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('ok');
        expect(res.body.ok).to.be.true;
        expect(res.body).to.have.property('roomGroups');
        done();
      });
  });
});
