'use strict';

const fs = require('fs'),
  models = {};

fs.readdirSync(`${__dirname}/`).forEach((file) => {
  if (file.includes('.js') && !file.includes('index')) {
    const fileName = file.substring(0, file.indexOf('.'));
    models[fileName] = require(`./${fileName}`);
  }
});

module.exports = models;
