module.exports = function (sequelize, DataTypes) {
	const user = sequelize.define(
		"users",
		{
			user_id: {
				type: DataTypes.BIGINT,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			display_name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			email_address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			verified_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			createdAt: "created_at",
			updatedAt: "updated_at",
			tableName: "users",
			underscored: true,
		}
	);
	user.associate = (models) => {
		user.hasMany(models.boards, { foreignKey: "user_id" });
		user.hasMany(models.comments, { foreignKey: "user_id" });
	};
	return user;
};
