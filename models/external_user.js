module.exports = function(sequelize, DataTypes) {
	return sequelize.define('ExternalUser', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true	
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		roomId: {
			type: DataTypes.INTEGER,
			unique: 'compositExternalUserIndex'
		},
		externalType: {
			type: DataTypes.STRING,
			unique: 'compositExternalUserIndex'
		},
		externalId: {
			type: DataTypes.STRING,
			unique: 'compositExternalUserIndex'
		},
		name: DataTypes.STRING
	});
}