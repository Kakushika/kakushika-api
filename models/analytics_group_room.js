module.exports = function(sequelize, DataTypes) {
	return sequelize.define('AnalyticsGroupRoom',{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true	
		},
		analyticsGroupId: {
			type: DataTypes.INTEGER,
			unique: 'conpositAnalyticsGroupRoomIndex'
		},
		roomId: {
			type: DataTypes.INTEGER,
			unique: 'conpositAnalyticsGroupRoomIndex'
		}
	});
}