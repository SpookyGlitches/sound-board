module.exports = function (sequelize, DataTypes) {
	const category = sequelize.define(
		"categories",
		{
			category_id: {
				type: DataTypes.BIGINT,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			board_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				references: {
					model: "boards",
					key: "board_id",
				},
			},

			name: {
				type: DataTypes.STRING,
				default: false,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			createdAt: "created_at",
			updatedAt: "updated_at",
			tableName: "categories",
			underscored: true,
		}
	);
	category.associate = (models) => {
		category.belongsTo(models.boards, {
			foreignKey: "board_id",
			onDelete: "cascade",
		});
		category.hasMany(models.sounds, {
			foreignKey: "board_id",
		});
	};
	return category;
};
