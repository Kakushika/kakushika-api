'use strict';

module.exports = function(sequelize, DataTypes) {
  var AnalyticsGroupMesh = sequelize.define('AnalyticsGroupMesh', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    parentAnalyticsGroupId: {
      type: DataTypes.STRING,
      unique: 'conpositAnalyticsGroupMeshIndex'
    },
    childAnalyticsGroupId: {
      type: DataTypes.STRING,
      unique: 'conpositAnalyticsGroupMeshIndex'
    }
  });

  return AnalyticsGroupMesh;
};
