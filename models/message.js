module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Message', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true	
		},
		roomId: DataTypes.INTEGER,
		raw: DataTypes.STRING,
		message: DataTypes.STRING,
		pubDate: DataTypes.DATE
	});
}