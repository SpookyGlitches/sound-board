"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("users", {
			user_id: {
				type: Sequelize.DataTypes.BIGINT,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			display_name: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			email_address: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			status: {
				type: Sequelize.DataTypes.ENUM(
					"ACTIVE",
					"INACTIVE"
				),
				defaultValue: "INACTIVE",
				allowNull: false,
			},
			token: {
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
		await queryInterface.dropTable("users");
	},
};
