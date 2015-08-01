module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Room', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true	
		},
		userId: {
			type: DataTypes.INTEGER,
			unique: 'compositRoomIndex'
		},
		externalType: {
			type: DataTypes.STRING,
			unique: 'compositRoomIndex'
		},
		externalId: {
			type: DataTypes.STRING,
			unique: 'compositRoomIndex'
		},
		name: DataTypes.STRING
	});
}