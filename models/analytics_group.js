
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AnalyticsGroup', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true	
		},
		userId: {
			type: DataTypes.INTEGER
		}
	});
}





