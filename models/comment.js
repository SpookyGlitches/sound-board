module.exports = function (sequelize, DataTypes) {
	const comment = sequelize.define(
		"comments",
		{
			comment_id: {
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
			content: {
				type: DataTypes.STRING,
				default: false,
				allowNull: false,
			},
		},
		{
			createdAt: "created_at",
			updatedAt: false,
			tableName: "comments",
			underscored: true,
		}
	);
	comment.associate = (models) => {
		comment.belongsTo(models.boards, {
			foreignKey: "board_id",
			onDelete: "cascade",
		});
		comment.belongsTo(models.users, {
			foreignKey: "user_id",
			onDelete: "cascade",
		});
	};
	return comment;
};
