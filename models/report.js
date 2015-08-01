'use strict';

module.exports = function(sequelize, DataTypes) {
  var Report = sequelize.define('Report', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    analyticsGroupId: {
      type: DataTypes.INTEGER
    },
    analyzeDate: DataTypes.DATE
  });

  return Report;
};
