const { body } = require("express-validator");

const sound = [
	body("label")
		.trim()
		.isLength({ min: 1, max: 64 })
		.withMessage("Label must be between 1-64 characters"),
	body("description")
		.trim()
		.isLength({ max: 128 })
		.withMessage("Description must be between 0-128 characters"),
];

module.exports = sound;
