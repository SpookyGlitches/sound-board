"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("comments", {
			comment_id: {
				type: Sequelize.DataTypes.BIGINT,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			user_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				references: { model: "users", key: "user_id" },
			},
			board_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				references: {
					model: "boards",
					key: "board_id",
				},
			},
			content: {
				type: Sequelize.DataTypes.STRING,
				default: false,
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},
			deleted_at: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("comments");
	},
};
