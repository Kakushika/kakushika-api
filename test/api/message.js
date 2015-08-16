'use strict';

var expect = require('chai').expect,
  supertest = require('supertest'),
  app = require('../../app');

describe('Message', function() {
  it('should return a not ok', function(done) {
    supertest(app)
      .get('/message')
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

  it('should return a ok', function(done) {
    supertest(app)
      .get('/message')
      .set('x-access-token', global.accessToken)
      .query('room_id=' + global.roomId)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('ok');
        expect(res.body.ok).to.be.true;
        expect(res.body).to.have.property('messages');
        done();
      });
  });

  it('should return a ok', function(done) {
    supertest(app)
      .get('/message')
      .set('x-access-token', global.accessToken)
      .query('analytics_group_id=' + global.analyticsGroupId)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('ok');
        expect(res.body.ok).to.be.true;
        expect(res.body).to.have.property('rooms');
        done();
      });
  });
});
