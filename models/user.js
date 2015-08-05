'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    passwordHash: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Room, {
          through: models.Readable,
          as: 'ReadableRooms',
          foreignKey: 'userId'
        });
        User.hasMany(models.Claim, {
          as: 'Claims',
          foreignKey: 'userId'
        });
        User.hasMany(models.ExternalUser, {
          as: 'ExternalUsers',
          foreignKey: 'userId'
        });
        User.hasMany(models.AnalyticsGroup, {
          as: 'AnalyticsGroup',
          foreignKey: 'userId'
        });
        User.hasMany(models.Room, {
          as: 'Rooms',
          foreignKey: 'userId'
        });
      }
    }
  });

  return User;
};
