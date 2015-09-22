
'use strict';

var bcrypt = require('bcrypt-nodejs'),
  config = require('config'),
  edge = require('edge'),
  claim = require('./claim.js');

var create = edge.func('sql-o', function() {
  /*
      INSERT INTO Users([email], [name], [passwordHash])
      OUTPUT INSERTED.*
      VALUES(@email, @name, @hash)
  */
});
var single = edge.func('sql-o', function() {
  /*
      SELECT TOP(1) [id], [email], [name], [registered] FROM Users
      WHERE [id] = @id
  */
});
var singleByEmail = edge.func('sql-o', function() {
  /*
      SELECT TOP(1) [id], [email], [name], [registered] FROM Users
      WHERE [email] = @email
  */
});
var isRegistered = edge.func('sql-o', function() {
  /*
      SELECT TOP(1) [id] FROM Users
      WHERE [email] = @email AND [passwordHash] = @hash AND [registered] = 1
  */
});
var register = edge.func('sql-o', function() {
  /*
      UPDATE Users
      SET [registered] = 1
      WHERE [id] = @id
  */
});

function createCallback(resolve, reject) {
  return function callback(err, result) {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  };
}

function createSingleCallback(resolve, reject) {
  return function callback(err, result) {
    if (err) {
      reject(err);
    } else {
      resolve(result[0]);
    }
  };
}

function getHashPassword(password, callback) {
  bcrypt.genSalt(config.login.password.cost, function(err, salt) {
    bcrypt.hash(password, salt, callback);
  });
}

var user = {
  create: function(email, name, password) {
    return new Promise(function(resolve, reject) {
      getHashPassword(password, function(err, hash) {
        if (err) {
          return reject(err);
        }
        create({
          email: email,
          name: name,
          hash: hash
        }, createSingleCallback(resolve, reject));
      });
    }).then(function(user) {
      return new Promise(function(resolve, reject) {
        claim.createRegisterToken(user).then(function(claim) {
          resolve({
            user: user,
            registerToken: claim.value
          });
        }, reject);
      });
    });
  },
  single: function(id) {
    return new Promise(function(resolve, reject) {
      single({
        id: id
      }, createSingleCallback(resolve, reject));
    });
  },
  singleByEmail: function(email) {
    return new Promise(function(resolve, reject) {
      singleByEmail({
        email: email
      }, createSingleCallback(resolve, reject));
    });
  },
  register: function(id) {
    return new Promise(function(resolve, reject) {
      register({
        id: id
      }, createCallback(resolve, reject));
    });
  },
  isRegistered: function(email, password) {
    return new Promise(function(resolve, reject) {
      getHashPassword(password, function(err, hash) {
        if (err) {
          return reject(err);
        }
        isRegistered({
          email: email,
          hash: hash
        }, createSingleCallback(resolve, reject));
      });
    });
  }
};

module.exports = user;
