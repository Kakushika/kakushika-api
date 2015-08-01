module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Report', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true	
		},
		analyticsGroupId: {
			type: DataTypes.INTEGER
		},
		analyzeDate: DataTypes.DATE
	});
}