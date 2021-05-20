"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("categories", {
			category_id: {
				type: Sequelize.DataTypes.BIGINT,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			board_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				references: {
					model: "boards",
					key: "board_id",
				},
			},
			name: {
				type: Sequelize.DataTypes.STRING,
				default: false,
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
		await queryInterface.dropTable("categories");
	},
};
