'use strict';

var fs = require('fs'),
  path = require('path'),
  config = require('config'),
  Sequelize = require('sequelize'),
  sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db),
  db = {};

fs.readdirSync(__dirname + '/').forEach(function(file) {
  if (~file.indexOf('.js') && !~file.indexOf('index')) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  }
});

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
