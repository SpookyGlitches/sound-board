const { body } = require("express-validator");

const sound = [
	body("label")
		.trim()
		.isLength({ min: 1, max: 16 })
		.withMessage("Label must be between 1-16 characters"),
	body("description")
		.trim()
		.isLength({ min: 8, max: 32 })
		.withMessage("Description must be between 8-32 characters"),
];

module.exports = sound;
