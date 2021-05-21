const { body } = require("express-validator");

const category = [
	body("content")
		.trim()
		.isLength({ min: 1, max: 32 })
		.withMessage("Content must be between 1-32 characters"),
];

module.exports = category;
