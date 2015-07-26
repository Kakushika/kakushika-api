'use strict';

var fs = require('fs'),
  config = {};

// require models
fs.readdirSync(__dirname + '/').forEach(function(file) {
  if (~file.indexOf('.js') && !~file.indexOf('index')) {
    config[file.substring(0, file.indexOf('.'))] = require(__dirname + '/' + file);
  }
});

module.exports = config;
