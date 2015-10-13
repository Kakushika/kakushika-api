'use strict';

const user = require('./user.js'),
  claim = require('./claim.js'),
  roomGroup = require('./room_group.js'),
  room = require('./room.js'),
  message = require('./message.js'),
  folder = require('./folder.js');

const models = {
  user,
  claim,
  roomGroup,
  room,
  message,
  folder
};

module.exports = models;
