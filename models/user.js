'use strict';

var bcrypt = require('bcrypt-nodejs'),
  config = require('config');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      set: function(val) {
        var salt = bcrypt.genSaltSync(config.login.password.cost);
        var hash = bcrypt.hashSync(val, salt);
        this.setDataValue('passwordHash', hash);
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Room, {
          through: models.Readable,
          as: 'ReadableRooms',
          foreignKey: 'userId'
        });
        User.hasMany(models.Claim, {
          as: 'Claims',
          foreignKey: 'userId'
        });
        User.hasMany(models.ExternalUser, {
          as: 'ExternalUsers',
          foreignKey: 'userId'
        });
        User.hasMany(models.AnalyticsGroup, {
          as: 'AnalyticsGroup',
          foreignKey: 'userId'
        });
        User.hasMany(models.Room, {
          as: 'Rooms',
          foreignKey: 'userId'
        });
      }
    },
    instanceMethods: {
      setPassword: function(password, done) {
        return bcrypt.genSalt(config.login.password.cost, function(err, salt) {
          return bcrypt.hash(password, salt, function(error, hash) {
            this.passwordHash = hash;
            return done();
          });
        });
      },
      verifyPassword: function(password, done) {
        bcrypt.compare(password, this.passwordHash, function(err, res) {
          return done(err, res);
        });
      }
    }
  });

  return User;
};
