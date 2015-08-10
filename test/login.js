'use strict';

var expect = require('chai').expect,
  supertest = require('supertest'),
  app = require('../app'),
  models = require('../models');

describe('Login', function() {
  before(function (done) {
    models.User.create({
      email: 'hoge@hoge.net',
      passwordHash: 'hoge'
    }).then(function() {
      done();
    });
  });

  it('should return a 400 response', function(done) {
    supertest(app)
      .post('/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect(400, done);
  });

  it('should return a 200 response', function (done) {
    supertest(app)
      .post('/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        'email': 'hoge@hoge.net',
        'password': 'hoge'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        // expect(res.header).to.have.property('location');
        // expect(res.header.location).not.to.be.null;
        done();
      });
  });

  it('should return a 200 response', function (done) {
    supertest(app)
      .get('/logout')
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        // expect(res.header).to.have.property('location');
        // expect(res.header.location).not.to.be.null;
        done();
      });
  });

  after(function (done) {
    models.sequelize.sync({
      force: true
    }).then(function() {
      done();
    });
  });
});
