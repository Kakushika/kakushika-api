module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Claim', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true	
		},
		userId: {
			type: DataTypes.INTEGER,
			unique: 'compositeClaimIndex'
		},
		key: {
			type: DataTypes.STRING,
			unique: 'compositeClaimIndex',
		},
		value: DataTypes.STRING
	});
}