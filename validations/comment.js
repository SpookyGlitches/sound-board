const { body } = require("express-validator");

const category = [
	body("content")
		.trim()
		.isLength({ min: 1, max: 128 })
		.withMessage("Content must be between 1-128 characters"),
];

module.exports = category;
