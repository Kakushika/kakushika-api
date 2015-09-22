
'use strict';

var edge = require('edge');

var getInRoom = edge.func('sql-o', function() {
  /*
      SELECT m.*, a.[id] AS assetId, a.[type], a.[title], a.[link] FROM Messages AS m
      INNER JOIN Assets AS a ON m.[id] = a.[id]
      WHERE m.[roomId] = @roomId
      ORDER BY m.[pubDate] DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
  */
});

var getInRooms = edge.func('sql-o', function() {
  /*
      SELECT m.*, a.[id] AS assetId, a.[type], a.[title], a.[link] FROM Messages AS m
      INNER JOIN Assets AS a ON m.[id] = a.[id]
      WHERE m.[roomId] IN @roomIds
      ORDER BY m.[pubDate] DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
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

var message = {
  getInRooms: function(roomIds, offset, limit) {
    return new Promise(function(resolve, reject) {
      getInRooms({
        roomIds: roomIds,
        offset: offset || 0,
        limit: limit || 100
      }, createCallback(resolve, reject));
    });
  },
  getInRoom: function(roomId, offset, limit) {
    return new Promise(function(resolve, reject) {
      getInRoom({
        roomId: roomId,
        offset: offset || 0,
        limit: limit || 100
      }, createCallback(resolve, reject));
    });
  }
};

module.exports = message;
