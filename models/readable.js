'use strict';

module.exports = function(sequelize, DataTypes) {
  var Readable = sequelize.define('Readable', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: 'conpositReadableIndex'
    },
    roomId: {
      type: DataTypes.INTEGER,
      unique: 'conpositReadableIndex'
    }
  });

  return Readable;
};
