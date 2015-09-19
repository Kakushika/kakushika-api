"use strict";

var user = require('./user.js')
  , claim = require('./claim.js')
  , group = require('./room_group.js')
  , room = require('./room.js')
  , message = require('./message.js')
  , folder = require('./folder.js');

var models = {
    user: user,
    claim: claim,
    roomGroup: group,
    room: room,
    message: message,
    folder: folder
}

module.exports = models;
