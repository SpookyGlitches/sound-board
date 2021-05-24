module.exports = function (sequelize, DataTypes) {
	const saved_board = sequelize.define(
		"saved_boards",
		{
			saved_board_id: {
				type: DataTypes.BIGINT,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				references: { model: "users", key: "user_id" },
			},
			board_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				references: {
					model: "boards",
					key: "board_id",
				},
			},
			is_pinned: {
				type: DataTypes.BOOLEAN,
				default: false,
			},
		},
		{
			createdAt: "created_at",
			updatedAt: "updated_at",
			tableName: "saved_boards",
			underscored: true,
		}
	);
	saved_board.associate = (models) => {
		saved_board.belongsTo(models.boards, {
			foreignKey: "board_id",
			onDelete: "cascade",
		});
		saved_board.belongsTo(models.users, {
			foreignKey: "user_id",
			onDelete: "cascade",
		});
	};
	return saved_board;
};
