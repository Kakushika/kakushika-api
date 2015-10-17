'use strict';

const edge = require('edge');

const create = edge.func('sql-o', () => {
  /*
    INSERT INTO R_RoomReadableUsers(userId, roomId)
    OUTPUT INSERTED.*
    VALUES (@userId, @roomId)
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

const roomReadable = {
  create: (userId, roomId) => {
    return new Promise((resolve, reject) => {
      create({
        userId,
        roomId
      }, createSingleCallback(resolve, reject));
    });
  }
};

module.exports = roomReadable;
