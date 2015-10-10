'use strict';

var edge = require('edge');

var create = edge.func('sql-o', () => {
  /*
      INSERT INTO Claims([userId], [key], [value])
      OUTPUT INSERTED.*
      VALUES(@userId, @key, @value)
  */
});
var createRegisterToken = edge.func('sql-o', () => {
  /*
      INSERT INTO Claims([userId], [key], [value])
      OUTPUT INSERTED.*
      VALUES(@userId, 'registerToken', NEWID())
  */
});
var single = edge.func('sql-o', () => {
  /*
      SELECT TOP(1) [value] FROM Claims
      WHERE [userId] = @userId AND [key] = @key
  */
});
var update = edge.func('sql-o', () => {
  /*
      UPDATE Claims
      SET [value] = @value
      WHERE [userId] = @userId AND [key] = @key
  */
});

function createSingleCallback(reject, resolve) {
  return function callback(err, result) {
    if (err) {
      reject(err);
    } else {
      resolve(result[0]);
    }
  };
}

var claim = {
  create: (userId, key, value) => {
    return new Promise((resolve, reject) => {
      create({
        userId: userId,
        key: key,
        value: value
      }, createSingleCallback(reject, resolve));
    });
  },
  createRegisterToken: (userId) => {
    return new Promise((resolve, reject) => {
      createRegisterToken({
        userId: userId
      }, createSingleCallback);
    });
  },
  single: (userId, key) => {
    return new Promise((resolve, reject) => {
      single({
        userId: userId,
        key: key
      }, createSingleCallback(reject, resolve));
    });
  },
  update: (userId, key, value) => {
    return new Promise((resolve, reject) => {
      create({
        userId: userId,
        key: key,
        value: value
      }, createSingleCallback(reject, resolve));
    });
  },
};

module.exports = claim;
