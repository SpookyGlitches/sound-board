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
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	console.log("here");
	sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config
	);
}

// const User = require("./user")(sequelize, DataTypes);
// const Board = require("./board")(sequelize, DataTypes);
// const SavedBoard = require("./saved_board")(sequelize, DataTypes);
const models = [
	require("./user")(sequelize, DataTypes),
	require("./board")(sequelize, DataTypes),
	require("./saved_board")(sequelize, DataTypes),
	require("./category")(sequelize, DataTypes),
	require("./sound")(sequelize, DataTypes),
	require("./comment")(sequelize, DataTypes),
];

// fs.readdirSync(__dirname)
// 	.filter((file) => {
// 		return (
// 			file.indexOf(".") !== 0 &&
// 			file !== basename &&
// 			file.slice(-3) === ".js"
// 		);
// 	})
// 	.forEach((file) => {
// 		const model = require(path.join(__dirname, file))(
// 			sequelize,
// 			Sequelize.DataTypes
// 		);
// 		db[model.name] = model;
// 	});

models.forEach((model) => {
	console.log(model.name);
	db[model.name] = model;
});

models.forEach((model) => {
	if (db[model.name].associate) {
		db[model.name].associate(db);
	}
});
// db.users = User;
// db.boards = Board;
// db.svboards = SavedBoard;

// db.users.hasMany(db.boards, { foreignKey: "user_id" });

// db.boards.belongTo(db.users, { foreignKey: "user_id" });

// db.users = Object.keys(db).forEach((modelName) => {
// 	if (db[modelName].associate) {
// 		db[modelName].associate(db);
// 	}
// });
db.sequelize = sequelize;
db.Sequelize = Sequelize;
// db.sequelize.authenticate();
module.exports = db;
