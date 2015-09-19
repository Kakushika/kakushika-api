"use strict";

var edge = require('edge')
  , Promise = require('promise')
  , group = require('./room_group.js');

var create = edge.func('sql-o', function () {
    /*
        INSERT INTO Rooms([ownerId], [externalId], [externalType], [name], [roomGroupId])
        OUTPUT INSERTED.*
        VALUES(@ownerId, @externalId, @externalType, @name, @groupId)
    */ 
});
var getInFolder = edge.func('sql-o', function () {
    /*
        SELECT * FROM Rooms 
        WHERE [id] IN (
            SELECT [roomId] FROM R_FolderRoomEdges
            WHERE [folderId] = @folderId
        ));
    */ 
});

function createCallback(resolve, reject) {
    return function callback(err, result) {
        if (err)
            reject(err);
        else
            resolve(result);
    }
}
function createSingleCallback(reject, resolve) {
    return function callback(err, result) {
        if (err)
            reject(err);
        else
            resolve(result[0]);
    }
}

var room = {
    create: function (userId, externalId, externalType, name, groupId) {
        return new Promise(function (resolve, reject) {
            create({
                userId: userId,
                externalId: externalId,
                externalType: externalType,
                name: name,
                groupId: groupId || null
            }, createSingleCallback);
        });
    },
    getInFolder: function (folderId){
        return new Promise(function (resolve, reject) {
            getInFolder({ folderId: folderId }, createCallback);
        }).then(function (rooms) {
            var ids = [];
            for (var i = 0; i < ids.length; i++)
                if (ids[i].roomGroupId)
                    ids.push(ids[i].roomGroupId);
            return new Promise(function (resolve, reject) {
                group.getIn(ids).then(function (grups) {
                    resolve({
                        roomGroups: groups,
                        rooms: rooms
                    })
                }, reject);
            });
        });
    }
}

module.exports = room;