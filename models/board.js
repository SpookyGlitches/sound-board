const { DataTypes } = require("sequelize");
const db = require("../config/connection");

const board = db.define(
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
	}
);

board.associate = (models) => {
	board.belongsTo(models.user, {
		foreignKey: {
			allowNull: false,
		},
	});
};

module.exports = board;
