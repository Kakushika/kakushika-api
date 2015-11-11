'use strict';

const bcrypt = require('bcryptjs'),
  config = require('config'),
  edge = require('edge'),
  claim = require('./claim.js');

const create = edge.func('sql-o', () => {
  /*
      INSERT INTO Users([email], [name], [passwordHash])
      OUTPUT INSERTED.*
      VALUES(@email, @name, @hash)
  */
});

const readByEmail = edge.func('sql-o', () => {
  /*
    SELECT TOP(1) [id], [email], [name], [passwordHash] FROM Users
    WHERE [email] = @email
   */
});

const readsByName = edge.func('sql-o', () => {
  /*
    SELECT TOP(@limit) [id], [name] FROM Users
    WHERE [name] LIKE @startWith + '%'
   */
});

const single = edge.func('sql-o', () => {
  /*
      SELECT TOP(1) [email], [name], [registered], [home] FROM Users
      WHERE [id] = @id
  */
});

const singleByEmail = edge.func('sql-o', () => {
  /*
      SELECT TOP(1) [id], [email], [name], [registered] FROM Users
      WHERE [email] = @email
  */
});

const isRegistered = edge.func('sql-o', () => {
  /*
      SELECT TOP(1) [id] FROM Users
      WHERE [email] = @email AND [passwordHash] = @hash AND [registered] = 1
  */
});

const register = edge.func('sql-o', () => {
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
  bcrypt.genSalt(config.login.password.cost, (err, salt) => {
    bcrypt.hash(password, salt, callback);
  });
}

const user = {
  create: (email, name, password) => {
    return new Promise((resolve, reject) => {
      getHashPassword(password, (err, hash) => {
        if (err) {
          return reject(err);
        }
        create({
          email: email,
          name: name,
          hash: hash
        }, createSingleCallback(resolve, reject));
      });
    }).then((user) => {
      return new Promise((resolve, reject) => {
        claim.createRegisterToken(user)
          .then((claim) => {
            resolve({
              user: user,
              registerToken: claim.value
            });
          }, reject);
      });
    });
  },
  verify: (email, password) => {
    return new Promise((resolve, reject) => {
      readByEmail({
        email
      }, (err, user) => {
        if (err) {
          return reject(err);
        }
        bcrypt.compare(password, user[0].passwordHash, (err, res) => {
          if (err || !res) {
            return reject(err);
          }
          return resolve(user[0]);
        });
      });
    });
  },
  readsByName: (startWith, limit) => {
    return new Promise((resolve, reject) => {
      readsByName({
        startWith,
        limit
      }, createCallback(resolve, reject));
    });
  },
  single: (id) => {
    return new Promise((resolve, reject) => {
      single({
        id: id
      }, createSingleCallback(resolve, reject));
    });
  },
  singleByEmail: (email) => {
    return new Promise((resolve, reject) => {
      singleByEmail({
        email: email
      }, createSingleCallback(resolve, reject));
    });
  },
  register: (id) => {
    return new Promise((resolve, reject) => {
      register({
        id: id
      }, createCallback(resolve, reject));
    });
  },
  isRegistered: (email, password) => {
    return new Promise((resolve, reject) => {
      getHashPassword(password, (err, hash) => {
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
