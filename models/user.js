module.exports = function(sequelize, DataTypes) {
	return sequelize.define('User',{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true	
		},
		email: {
			type: DataTypes.STRING,
			unique: true
		},
		password: DataTypes.STRING
	});
}