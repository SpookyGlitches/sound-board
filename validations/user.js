const { body } = require("express-validator");

const signup = [
	body("email_address")
		.isEmail()
		.withMessage(
			"Email address field must be of type email address"
		),
	body("display_name")
		.trim()
		.isLength({ min: 2, max: 20 })
		.withMessage("Display name must have 2-20 characters"),
	body("password")
		.isStrongPassword()
		.withMessage(
			"Password must be minimum of 8 characters and contain an upppercase, lowercase, number, and a symbol."
		),
	body("confirm_password")
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage("Passwords do not match"),
];

const signin = [
	body("email_address")
		.isEmail()
		.withMessage(
			"Email address field must be of type email address"
		),
	body("password")
		.not()
		.isEmpty()
		.withMessage("Password field must not be empty"),
];

module.exports = {
	signup,
	signin,
};
