'use strict';

module.exports = function(sequelize, DataTypes) {
  var ExternalUser = sequelize.define('ExternalUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    roomId: {
      type: DataTypes.INTEGER,
      unique: 'compositExternalUserIndex'
    },
    externalType: {
      type: DataTypes.STRING,
      unique: 'compositExternalUserIndex'
    },
    externalId: {
      type: DataTypes.STRING,
      unique: 'compositExternalUserIndex'
    },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        ExternalUser.belongsTo(models.User, {
          foreignKey: 'userId'
        });
        ExternalUser.belongsTo(models.Room, {
          foreignKey: 'roomId'
        });
        ExternalUser.hasMany(models.MessageProperty, {
          foreignKey: 'externalUserId'
        });
      }
    }
  });

  return ExternalUser;
};
