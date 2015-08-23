'use strict';

if(process.env.CI) {
  process.env.NODE_ENV = 'test';
}

var fs = require('fs'),
  path = require('path'),
  config = require('config'),
  SqlString = require('../node_modules/sequelize/lib/sql-string'),
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

sequelize.dialect.QueryGenerator.escape = function(value, field){
  if (value && value._isSequelizeMethod) {
    return this.handleSequelizeMethod(value);
  } else {
    if (field && field.type && value) {
      if (field.type.validate) {
        field.type.validate(value);
      }
    }
    var escaped = SqlString.escape(value, false, this.options.timezone, this.dialect, field);
    if(field && field.type && (field.type instanceof Sequelize.STRING || field.type instanceof Sequelize.TEXT)){
      escaped = 'N' + escaped;
    }
    return escaped;
  }
};

module.exports = db;
