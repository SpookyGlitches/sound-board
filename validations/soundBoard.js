const { body } = require("express-validator");

const sboard = [
	body("name")
		.trim()
		.isLength({ min: 1, max: 32 })
		.withMessage("Name must be between 1-32 characters"),
	body("description")
		.trim()
		.isLength({ max: 128 })
		.withMessage("Description must be between 0-128 characters"),
	body("tags")
		.trim()
		.isLength({ min: 1 })
		.withMessage("Tags must not be empty"),
];

module.exports = sboard;
