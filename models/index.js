"use strict";

var user = require('./user.js')
  , claim = require('./claim.js')
  , group = require('./room_group.js')
  , room = require('./room.js');

var model = {
    user: user,
    claim: claim,
    roomGroup: group,
    room: room
}

module.exports = model;
