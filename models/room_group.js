"use strict";

var edge = require('edge')
  , Promise = require('promise');

var create = edge.func('sql-o', function () {
    /*
        INSERT INTO RoomGroups([userId], [externalId], [externalType], [name])
        OUTPUT INSERTED.*
        VALUES(@userId, @externalId, @externalType, @name)
    */ 
});

var getInIds = edge.func('sql-o', function () {
    /*
        SELECT * FROM Rooms 
        WHERE [id] IN ({ids});
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

var group = {
    create: function (userId, externalId, externalType, name) {
        return new Promise(function (resolve, reject) {
            create({
                userId: userId,
                externalId: externalId,
                externalType: externalType,
                name: name
            }, createSingleCallback);
        });
    },
    getIn: function (ids){
        return new Promise(function (resolve, reject) {
            getInIds({ ids: ids}, createCallback);
        });
    } 
}

module.exports = group;