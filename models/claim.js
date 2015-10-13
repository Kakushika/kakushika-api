'use strict';

const edge = require('edge');

const create = edge.func('sql-o', () => {
  /*
      INSERT INTO Claims([userId], [key], [value])
      OUTPUT INSERTED.*
      VALUES(@userId, @key, @value)
  */
});
const createRegisterToken = edge.func('sql-o', () => {
  /*
      INSERT INTO Claims([userId], [key], [value])
      OUTPUT INSERTED.*
      VALUES(@userId, 'registerToken', NEWID())
  */
});
const single = edge.func('sql-o', () => {
  /*
      SELECT TOP(1) [value] FROM Claims
      WHERE [userId] = @userId AND [key] = @key
  */
});
const update = edge.func('sql-o', () => {
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

const claim = {
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
      }, createSingleCallback(resolve, reject));
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
