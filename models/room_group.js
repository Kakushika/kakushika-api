'use strict';

var edge = require('edge');

var create = edge.func('sql-o', () => {
  /*
      INSERT INTO RoomGroups([userId], [externalId], [externalType], [name])
      OUTPUT INSERTED.*
      VALUES(@userId, @externalId, @externalType, @name)
  */
});

var getInIds = edge.func('sql-o', () => {
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

var group = {
  create: (userId, externalId, externalType, name) => {
    return new Promise((resolve, reject) => {
      create({
        userId: userId,
        externalId: externalId,
        externalType: externalType,
        name: name
      }, createSingleCallback);
    });
  },
  getIn: (ids) => {
    return new Promise((resolve, reject) => {
      getInIds({
        ids: ids
      }, createCallback);
    });
  }
};

module.exports = group;
