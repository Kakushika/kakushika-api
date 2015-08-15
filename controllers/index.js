'use strict';

var fs = require('fs'),
  express = require('express'),
  passport = require('passport'),
  jwt = require('jsonwebtoken'),
  config = require('config'),
  router = express.Router();

fs.readdirSync(__dirname + '/').forEach(function(file) {
  if (~file.indexOf('.js') && !~file.indexOf('index')) {
    var fileName = file.substring(0, file.indexOf('.'));
    router.use('/' + fileName, require('./' + fileName));
  }
});

router.post('/login', passport.authenticate('local', {
  session: false
}), function(req, res) {
  var token = jwt.sign({
    id: req.user.id
  }, config.jwt.secret, {
    expiresInMinutes: 1440 // 24 hours
  });
  res.json({
    ok: true,
    token: token
  });
});

router.get('/', function(req, res) {
  res.json({
    ok: true
  });
});

module.exports = router;
