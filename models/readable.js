module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Readable',{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true	
		},
		userId: {
			type: DataTypes.INTEGER,
			unique: 'conpositReadableIndex'
		},
		roomId: {
			type: DataTypes.INTEGER,
			unique: 'conpositReadableIndex'
		}
	});
}