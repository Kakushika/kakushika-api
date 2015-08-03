'use strict';

var LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt'),
  config = require('config'),
  models = require('../models');

var getPasswordHash = function(password, cb) {
  bcrypt.genSalt(config.login.password.cost, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        cb(err);
      } else {
        cb(null, hash);
      }
    });
  });
};

var localStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    process.nextTick(function() {
      models.User.findOne({
        email: email
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'ユーザーが見つかりませんでした。'
          });
        }
        getPasswordHash(password, function(err, hash) {
          if (user.password !== hash) {
            return done(null, false, {
              message: 'パスワードが間違っています。'
            });
          }
          return done(null, user);
        });
      });
    });
  });

module.exports = localStrategy;
