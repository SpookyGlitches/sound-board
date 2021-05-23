"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

// const basename = path.basename("./");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
console.log(config);
if (config.use_env_variable) {
	sequelize = new Sequelize(
		process.env[config.use_env_variable],
		config,
		{
			logging: false,
		}
	);
} else {
	sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config,
		{
			logging: false,
		}
	);
}

const models = [
	require("./user")(sequelize, DataTypes),
	require("./board")(sequelize, DataTypes),
	require("./saved_board")(sequelize, DataTypes),
	require("./category")(sequelize, DataTypes),
	require("./sound")(sequelize, DataTypes),
	require("./comment")(sequelize, DataTypes),
];

models.forEach((model) => {
	console.log(model.name);
	db[model.name] = model;
});

models.forEach((model) => {
	if (db[model.name].associate) {
		db[model.name].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
