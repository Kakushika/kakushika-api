"use strict";

var edge = require('edge')
  , Promise = require('promise');

var create = edge.func('sql-o', function () {
    /*
        INSERT INTO Claims([userId], [key], [value])
        OUTPUT INSERTED.*
        VALUES(@userId, @key, @value)
    */ 
});
var createRegisterToken = edge.func('sql-o', function () {
    /*
        INSERT INTO Claims([userId], [key], [value])
        OUTPUT INSERTED.*
        VALUES(@userId, 'registerToken', NEWID())
    */ 
});
var single = edge.func('sql-o', function () {
    /*
        SELECT TOP(1) [value] FROM Claims
        WHERE [userId] = @userId AND [key] = @key
    */ 
});
var update = edge.func('sql-o', function () {
    /*
        UPDATE Claims
        SET [value] = @value
        WHERE [userId] = @userId AND [key] = @key
    */ 
});

function createSingleCallback(reject, resolve) {
    return function callback(err, result) {
        if (err)
            reject(err);
        else
            resolve(result[0]);
    }
}

var claim = {
    create: function (userId, key, value) {
        return new Promise(function (resolve, reject) {
            create({
                userId: userId,
                key: key,
                value: value
            }, createSingleCallback(reject, resolve));
        });
    },
    createRegisterToken: function (userId) {
        return new Promise(function (resolve, reject) {
            createRegisterToken({ userId: userId }, createSingleCallback);
        });
    },
    single: function (id) {
        return new Promise(function (resolve, reject) {
            single({
                userId: userId,
                key: key
            }, createSingleCallback(reject, resolve));
        });
    },
    update: function (userId, key, value) {
        return new Promise(function (resolve, reject) {
            create({
                userId: userId,
                key: key,
                value: value
            }, createSingleCallback(reject, resolve));
        });
    },
};

module.exports = claim;