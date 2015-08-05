'use strict';

module.exports = function(sequelize, DataTypes) {
  var RoomExternalUser = sequelize.define('RoomExternalUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    externalUserId: {
      type: DataTypes.INTEGER,
      unique: 'conpositRoomExternalUserIndex'
    },
    roomId: {
      type: DataTypes.INTEGER,
      unique: 'conpositRoomExternalUserIndex'
    }
  });

  return RoomExternalUser;
};
