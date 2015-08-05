'use strict';

module.exports = function(sequelize, DataTypes) {
  var RoomGroup = sequelize.define('RoomGroup', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
	 userId: {
      type: DataTypes.INTEGER,
      unique: 'compositRoomGroupIndex'
    },
    externalType: {
      type: DataTypes.STRING,
      unique: 'compositRoomGroupIndex'
    },
    externalId: {
      type: DataTypes.STRING,
      unique: 'compositRoomGroupIndex'
    },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        RoomGroup.belongsTo(models.User, {
          foreignKey: 'userId'
        });
        RoomGroup.hasMany(models.Room, {
          as: 'Rooms',
          foreignKey: 'roomGroupId'
        });
      }
    }
  });

  return RoomGroup;
};
