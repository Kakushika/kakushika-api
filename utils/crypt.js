'use strict';

const bcrypt = require('bcryptjs'),
  config = require('config');

function getHashPassword(password, callback) {
  bcrypt.genSalt(config.login.password.cost, (err, salt) => {
    bcrypt.hash(password, salt, callback);
  });
}

if (process.argv.length < 3) {
  return;
}

var password = process.argv[2];

getHashPassword(password, (err, hash) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(hash);
});
