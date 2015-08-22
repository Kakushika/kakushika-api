'use strict';

module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roomId: DataTypes.INTEGER,
    raw: DataTypes.TEXT,
    message: DataTypes.TEXT,
    messagePropertyId: DataTypes.STRING,
    pubDate: DataTypes.DATE
  });

  return Message;
};
