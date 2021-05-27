const { body } = require("express-validator");

const category = [
	body("name")
		.trim()
		.isLength({ min: 1, max: 32 })
		.withMessage("Name must be between 1-32 characters"),
	body("description")
		.trim()
		.isLength({ max: 128 })
		.withMessage("Description must have <= 128 characters"),
];

module.exports = category;
