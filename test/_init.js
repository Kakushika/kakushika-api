'use strict';

var supertest = require('supertest'),
  app = require('../app'),
  models = require('../models'),
  date = require('../utils/date');

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
      passwordHash: 'hoge',
      name: 'hoge'
    }).then(function(user) {
      global.userId = user.id;
      console.info(global.userId);
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
        'password': 'hoge',
        'name': 'hoge'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        global.accessToken = res.body.token;
        console.info(global.accessToken);
        done();
      });
  });

  it('create room', function(done) {
    models.RoomGroup.create({
      userId: global.userId,
      externalType: 'hoge',
      externalId: 'hogehoge',
      name: 'roomGroup'
    }).then(function(roomGroup) {
      models.Room.create({
        userId: global.userId,
        externalType: 'hoge',
        externalId: 'hogehoge',
        roomGroupId: roomGroup.id,
        name: 'room'
      }).then(function(room) {
        global.roomId = room.id;
        console.info(global.roomId);
        models.Readable.create({
          userId: global.userId,
          roomId: global.roomId
        }).then(function() {
          done();
        });
      }).catch(function(err) {
        console.error(err);
      });
    }).catch(function(err) {
      console.error(err);
    });
  });

  it('create message', function(done) {
    models.Message.create({
      roomId: global.roomId,
      raw: 'hogehoge',
      message: 'hogehoge',
      pubDate: date.getTimeStamp()
    }).then(function () {
      done();
    }).catch(function(err) {
      console.error(err);
    });
  });

  it('create analyticsGroup', function(done) {
    models.AnalyticsGroup.create({
      userId: global.userId
    }).then(function(analyticsGroup) {
      global.analyticsGroupId = analyticsGroup.id;
      models.AnalyticsGroupRoom.create({
        analyticsGroupId: analyticsGroup.id,
        roomId: global.roomId
      }).then(function() {
        done();
      });
    });
  });
});
