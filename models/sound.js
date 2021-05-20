const { DataTypes } = require("sequelize");
const db = require("../config/connection");

const sound = db.define(
	"sounds",
	{
		sound_id: {
			type: Sequelize.DataTypes.BIGINT,
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
			allowNull: false,
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

module.exports = sound;
