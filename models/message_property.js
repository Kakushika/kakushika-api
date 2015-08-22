'use strict';

module.exports = function(sequelize, DataTypes) {
  var MessageProperty = sequelize.define('MessageProperty', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    externalUserId: {
      type: DataTypes.INTEGER
    },
    messageId: {
      type: DataTypes.INTEGER,
      unique: true
    },
    isExtracted: {
      type: DataTypes.BOOLEAN
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
