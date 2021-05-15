const { DataTypes } = require("sequelize");
const db = require("../config/connection");

const comment = db.define(
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
		updatedAt: "updated_at",
		tableName: "comments",
	}
);

module.exports = comment;
