'use strict';

var edge = require('edge'),
  group = require('./room_group.js');

var create = edge.func('sql-o', () => {
  /*
      INSERT INTO Rooms([ownerId], [externalId], [externalType], [name], [roomGroupId])
      OUTPUT INSERTED.*
      VALUES(@ownerId, @externalId, @externalType, @name, @groupId)
  */
});

var getInFolder = edge.func('sql-o', () => {
  /*
      SELECT * FROM Rooms
      WHERE [id] IN (
          SELECT [roomId] FROM R_FolderRoomEdges
          WHERE [folderId] = @folderId
      );
  */
});

var createRelation = edge.func('sql-o', () => {
  /*
      INSERT INTO R_FolderRoomEdges(folderId, roomId)
      OUTPUT INSERTED.*
      VALUES (@folderId, @roomId)
   */
});

var deleteRelation = edge.func('sql-o', () => {
  /*
      DELETE FROM R_FolderRoomEdges
      OUTPUT DELETED.*
      WHERE folderId = @folderId AND roomId = @roomId
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

var room = {
  create: (userId, externalId, externalType, name, groupId) => {
    return new Promise((resolve, reject) => {
      create({
        userId: userId,
        externalId: externalId,
        externalType: externalType,
        name: name,
        groupId: groupId || null
      }, createSingleCallback(resolve, reject));
    });
  },
  createRelation: (userId, folderId, roomId) => {
    return new Promise((resolve, reject) => {
      createRelation({
        folderId: folderId,
        roomId: roomId
      }, createSingleCallback(resolve, reject));
    });
  },
  createRelations: (userId, folderId, roomIds) => {
    return Promise.all(
      roomIds.map((roomId) => {
        createRelation({
          folderId: folderId,
          roomId: roomId
        }, (err, result) => {
          if (err) {
            Promise.reject(err);
          } else {
            Promise.resolve(result[0]);
          }
        });
      })
    );
  },
  deleteRelations: (userId, folderId, roomIds) => {
    return Promise.all(
      roomIds.map((roomId) => {
        deleteRelation({
          folderId: folderId,
          roomId: roomId
        }, (err, result) => {
          if (err) {
            Promise.reject(err);
          } else {
            Promise.resolve(result[0]);
          }
        });
      })
    );
  },
  moveRelations: (userId, from, to, roomIds) => {
    return this.createRelations(userId, to, roomIds)
      .then(() => {
        return this.deleteRelations(userId, from, roomIds);
      }).then((result) => {
        return Promise.resolve(result.length);
      });
  },
  getInFolder: (userId, folderId) => {
    return new Promise((resolve, reject) => {
      getInFolder({
        folderId: folderId
      }, createCallback(resolve, reject));
    });
  }
};

module.exports = room;
