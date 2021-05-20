module.exports = function (sequelize, DataTypes) {
	const board = sequelize.define(
		"boards",
		{
			board_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				references: { model: "users", key: "user_id" },
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			tags: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			createdAt: "created_at",
			updatedAt: "updated_at",
			tableName: "boards",
			underscored: true,
		}
	);
	board.associate = (models) => {
		board.belongsTo(models.users, {
			foreignKey: "user_id",
			onDelete: "cascade",
		});
		board.hasMany(models.categories, {
			foreignKey: "board_id",
		});
	};
	return board;
};
