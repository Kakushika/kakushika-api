'use strict';

const fs = require('fs');
const controllers = {};

fs.readdirSync(`${__dirname}/`).forEach((file) => {
  if (file.includes('.js') && !file.includes('index')) {
    const fileName = file.substring(0, file.indexOf('.'));
    controllers[fileName] = require(`./${fileName}`);
  }
});

module.exports = controllers;
