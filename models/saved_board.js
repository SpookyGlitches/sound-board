const { DataTypes } = require("sequelize");
const db = require("../config/connection");

const saved_board = db.define(
	"saved_boards",
	{
		saved_boards_id: {
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
	}
);

module.exports = saved_board;
