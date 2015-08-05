'use strict';

module.exports = function(sequelize, DataTypes) {
  var Room = sequelize.define('Room', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: 'compositRoomIndex'
    },
    externalType: {
      type: DataTypes.STRING,
      unique: 'compositRoomIndex'
    },
    externalId: {
      type: DataTypes.STRING,
      unique: 'compositRoomIndex'
    },
    roomGroupId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Room.belongsTo(models.User, {
          foreignKey: 'userId'
        });
        Room.belongsToMany(models.User, {
          through: models.Readable,
          as: 'ReadableUsers',
          foreignKey: 'roomId'
        });
        Room.belongsToMany(models.AnalyticsGroup, {
          through: models.AnalyticsGroupRoom,
          as: 'AnalyticsGroups',
          foreignKey: 'roomId'
        });
        Room.belongsToMany(models.ExternalUser, {
          through: models.RoomExternalUser,
          as: 'ExternalUsers',
          foreignKey: 'roomId'
        });
        Room.hasMany(models.Message, {
          as: 'Messages',
          foreignKey: 'roomId'
        });
      }
    }
  });

  return Room;
};
