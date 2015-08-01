'use strict';

module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roomId: DataTypes.INTEGER,
    raw: DataTypes.STRING,
    message: DataTypes.STRING,
    pubDate: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Message.hasOne(models.MessageProperty, {
          as: 'Property',
          foreignKey: 'messageId'
        });
      }
    }
  });

  return Message;
};
