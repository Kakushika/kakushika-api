'use strict';

var supertest = require('supertest'),
  app = require('../app'),
  models = require('../models');

describe('Initialization', function() {
  it('cleanup database', function(done) {
    models.sequelize.sync({
      force: true
    }).then(function() {
      done();
    }).catch(function(err) {
      console.error(err);
    });
  });

  it('create user', function(done) {
    models.User.create({
      email: 'hoge@hoge.net',
      passwordHash: 'hoge'
    }).then(function() {
      done();
    }).catch(function(err) {
      console.error(err);
    });
  });

  it('get access token', function(done) {
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
        global.accessToken = res.body.token;
        done();
      });
  });
});
