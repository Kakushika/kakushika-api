'use strict';

module.exports = function(sequelize, DataTypes) {
  var AnalyticsUser = sequelize.define('AnalyticsUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: 'conpositAnalyticsUserIndex'
    },
    analyticsGroupId: {
      type: DataTypes.INTEGER,
      unique: 'conpositAnalyticsUserIndex'
    }
  });

  return AnalyticsUser;
};
