"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("sounds", {
			sound_id: {
				type: Sequelize.DataTypes.BIGINT,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			category_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				references: {
					model: "categories",
					key: "category_id",
				},
			},
			label: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			file: {
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
