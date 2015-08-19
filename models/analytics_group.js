'use strict';

module.exports = function(sequelize, DataTypes) {
  var AnalyticsGroup = sequelize.define('AnalyticsGroup', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        AnalyticsGroup.hasMany(models.Report, {
          as: 'Reports',
          foreignKey: 'analyticsGroupId'
        });
        AnalyticsGroup.belongsToMany(models.Room, {
          through: models.AnalyticsGroupRoom,
          as: 'Rooms',
          foreignKey: 'analyticsGroupId'
        });
        AnalyticsGroup.belongsToMany(models.AnalyticsGroup, {
          through: models.AnalyticsGroupMesh,
          as: 'ParentGroups',
          foreignKey: 'childAnalyticsGroupId'
        });
        AnalyticsGroup.belongsToMany(models.AnalyticsGroup, {
          through: models.AnalyticsGroupMesh,
          as: 'ChildGroups',
          foreignKey: 'parentAnalyticsGroupId'
        });
      }
    }
  });

  return AnalyticsGroup;
};
