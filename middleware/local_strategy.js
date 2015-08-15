'use strict';

var LocalStrategy = require('passport-local').Strategy,
  models = require('../models');

var localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password, done) {
  models.User.findOne({
    email: username
  }).then(function(user) {
    if (!user) {
      return done(null, false, {
        ok: false
      });
    }
    user.verifyPassword(password, function(err, res) {
      if (err) {
        return done(err);
      } else if (!res) {
        return done(null, false, {
          ok: false
        });
      } else {
        return done(null, user);
      }
    });
  }).catch(function(err) {
    return done(err);
  });
});

module.exports = localStrategy;
