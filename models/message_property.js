module.exports = function(sequelize, DataTypes) {
	return sequelize.define('MessageProperty', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true		
		},
		messageId: {
			type: DataTypes.INTEGER,
			unique: true
		},
		externalUserId: {
			type: DataTypes.INTEGER
		},
		name: DataTypes.STRING
	});
}