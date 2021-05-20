const { body } = require("express-validator");

const category = [
	body("name")
		.trim()
		.isLength({ min: 1, max: 16 })
		.withMessage("Name must be between 1-16 characters"),
	body("description")
		.trim()
		.isLength({ min: 4, max: 32 })
		.withMessage("Description must be between 4-32 characters"),
];

module.exports = category;
