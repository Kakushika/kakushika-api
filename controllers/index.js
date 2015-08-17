'use strict';

var fs = require('fs'),
  express = require('express'),
  router = express.Router();

fs.readdirSync(__dirname + '/').forEach(function(file) {
  if (~file.indexOf('.js') && !~file.indexOf('index')) {
    var fileName = file.substring(0, file.indexOf('.'));
    router.use('/' + fileName, require('./' + fileName));
  }
});

router.get('/', function(req, res) {
  res.json({
    ok: true
  });
});

module.exports = router;
