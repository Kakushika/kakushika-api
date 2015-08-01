if (!global.hasOwnProperty('db')) {
  var config = require('config')
  	, Sequelize = require('sequelize')
    , sequelize = null

	sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
		host: config.db.host,
		dialect: config.db.dialect,
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		},
		dialectOptions: {
			encrypt: true
		}
	});

	global.db = {
		Sequelize: Sequelize,
		sequelize: sequelize,
		User: sequelize.import(__dirname + '/user'),
		Claim: sequelize.import(__dirname + '/claim'),
		Room: sequelize.import(__dirname + '/room'),
		ExternalUser: sequelize.import(__dirname + '/external_user'), 
		Message: sequelize.import(__dirname + '/message'), 
		MessageProperty: sequelize.import(__dirname + '/message_property'), 
		AnalyticsGroup: sequelize.import(__dirname + '/analytics_group'), 
		Report: sequelize.import(__dirname + '/report'), 
		Readable: sequelize.import(__dirname + '/readable'), 
		AnalyticsGroupRoom: sequelize.import(__dirname + '/analytics_group_room'),
		create: function(){
			return global.db.User.create({force:true}).then(function(){
				return global.db.Claim.create({force:true});
			}).then(function(){
				return global.db.Room.create({force:true});
			}).then(function(){
				return global.db.ExternalUser.create({force:true});
			}).then(function(){
				return global.db.Message.create({force:true});
			}).then(function(){
				return global.db.MessageProperty({force:true});
			}).then(function(){
				return global.db.AnalyticsGroup({force:true});
			}).then(function(){
				return global.db.Report({force:true});
			}).then(function(){
				return global.db.Readable({force:true});
			}).then(function(){
				return global.db.AnalyticsGroupRoom({force:true});
			});
		}
	}
	global.db.User.hasMany(global.db.Claim, { foreignKey: 'userId', as: 'Claims' });
	global.db.User.hasMany(global.db.ExternalUser, { foreignKey: 'userId', as: 'ExternalUsers' });
	global.db.User.hasMany(global.db.AnalyticsGroup, { foreignKey: 'userId', as: 'AnalyticsGroup'});
	global.db.User.hasMany(global.db.Room, { foreignKey: 'ownerId', as: 'Rooms' });
	global.db.User.belongsToMany(global.db.Room, { through: global.db.Readable, as: 'ReadableRooms', foreignKey: 'userId' });
	global.db.AnalyticsGroup.hasMany(global.db.Report, { foreignKey: 'analyticsGroupId', as: 'Reports'});
	global.db.AnalyticsGroup.belongsToMany(global.db.Room, { through: global.db.AnalyticsGroupRoom, as: 'Rooms', foreignKey: 'analyticsGroupId'});
	global.db.Room.belongsTo(global.db.User, {foreignKey: 'userId'});
	global.db.Room.belongsToMany(global.db.User, { through: global.db.Readable, as: 'ReadableUsers', foreignKey: 'roomId' });
	global.db.Room.belongsToMany(global.db.AnalyticsGroup, { through: global.db.AnalyticsGroupRoom, as: 'Rooms', foreignKey: 'roomId'});
	global.db.Room.hasMany(global.db.ExternalUser, { foreignKey: 'roomId', as: 'ExternalUsers' });
	global.db.Room.hasMany(global.db.Message, { foreignKey: 'roomId', as: 'Messages' });
	global.db.ExternalUser.belongsTo(global.db.User, { foreignKey: 'userId' });
	global.db.ExternalUser.belongsTo(global.db.Room, { foreignKey: 'roomId' });
	global.db.ExternalUser.hasMany(global.db.MessageProperty, { foreignKey: 'externalUserId' });
	global.db.Message.hasOne(global.db.MessageProperty, { foreignKey: 'messageId', as: 'Property'});
	global.db.MessageProperty.belongsTo(global.db.ExternalUser, { foreignKey: 'externalUserId' });
}

module.exports = global.db