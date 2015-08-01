'use strict';

module.exports = function(sequelize, DataTypes) {
  var MessageProperty = sequelize.define('MessageProperty', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    messageId: {
      type: DataTypes.INTEGER,
      unique: true
    },
    externalUserId: {
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        MessageProperty.belongsTo(models.ExternalUser, {
          foreignKey: 'externalUserId'
        });
      }
    }
  });

  return MessageProperty;
};
