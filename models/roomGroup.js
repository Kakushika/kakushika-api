'use strict';

const edge = require('edge');

const create = edge.func('sql-o', () => {
  /*
      INSERT INTO RoomGroups([userId], [externalId], [externalType], [name])
      OUTPUT INSERTED.*
      VALUES(@userId, @externalId, @externalType, @name)
  */
});

const getInIds = edge.func('sql-o', () => {
  /*
      SELECT * FROM Rooms
      WHERE [id] IN ({ids});
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

function createSingleCallback(reject, resolve) {
  return function callback(err, result) {
    if (err) {
      reject(err);
    } else {
      resolve(result[0]);
    }
  };
}

const group = {
  create: (userId, externalId, externalType, name) => {
    return new Promise((resolve, reject) => {
      create({
        userId,
        externalId,
        externalType,
        name
      }, createSingleCallback(resolve, reject));
    });
  },
  getIn: (ids) => {
    return new Promise((resolve, reject) => {
      getInIds({
        ids
      }, createCallback(resolve, reject));
    });
  }
};

module.exports = group;
