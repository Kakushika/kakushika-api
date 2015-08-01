'use strict';

module.exports = function(sequelize, DataTypes) {
  var Claim = sequelize.define('Claim', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: 'compositeClaimIndex'
    },
    key: {
      type: DataTypes.STRING,
      unique: 'compositeClaimIndex',
    },
    value: DataTypes.STRING
  });

  return Claim;
};
