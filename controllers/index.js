'use strict';

var fs = require('fs'),
  express = require('express'),
  passport = require('passport'),
  router = express.Router();

fs.readdirSync(__dirname + '/').forEach(function(file) {
  if (~file.indexOf('.js') && !~file.indexOf('index')) {
    var fileName = file.substring(0, file.indexOf('.'));
    router.use('/' + fileName, require('./' + fileName));
  }
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.json({
    'ok': true
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.json({
    'ok': true
  });
});

router.get('/', function(req, res) {
  res.json({
    'ok': true
  });
});


module.exports = router;
