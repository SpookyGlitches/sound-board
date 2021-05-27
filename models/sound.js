module.exports = function (sequelize, DataTypes) {
	const sound = sequelize.define(
		"sounds",
		{
			sound_id: {
				type: DataTypes.BIGINT,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			category_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				references: {
					model: "categories",
					key: "category_id",
				},
			},
			label: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			file: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			createdAt: "created_at",
			updatedAt: "updated_at",
			tableName: "sounds",
			underscored: true,
		}
	);
	sound.associate = (models) => {
		sound.belongsTo(models.categories, {
			foreignKey: "category_id",
			onDelete: "cascade",
		});
	};
	return sound;
};
