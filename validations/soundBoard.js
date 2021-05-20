const { body } = require("express-validator");

const sboard = [
	body("name")
		.trim()
		.isLength({ min: 2, max: 16 })
		.withMessage("Name must be between 2-16 characters"),
	body("description")
		.trim()
		.isLength({ min: 8, max: 32 })
		.withMessage("Description must be between 8-32 characters"),
	body("tags")
		.trim()
		.isLength({ min: 1 })
		.withMessage("Tags must not be empty"),
];

module.exports = sboard;
