"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("boards", {
			board_id: {
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
			name: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.DataTypes.STRING,
				allowNull: true,
			},
			tags: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("boards");
	},
};
