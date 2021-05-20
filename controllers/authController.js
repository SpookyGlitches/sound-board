require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("../models/db");
const { Op, DataTypes } = require("sequelize");
const User = db.users;
const passport = require("passport");
const mailgun = require("mailgun-js");
const { v4: uuidv4 } = require("uuid");

exports.getLoginPage = (req, res) => {
	res.render("signIn");
};

exports.getSignupPage = (req, res) => {
	res.render("signUp");
};

exports.signin = passport.authenticate("local", {
	successRedirect: "/home",
	failureRedirect: "/auth/signin",
	failureFlash: true,
});

exports.signup = async (req, res, next) => {
	//todo
	//make password hash async
	try {
		let user = await User.findOne({
			where: {
				[Op.or]: [
					{
						display_name:
							req.body.display_name,
					},
					{
						email_address:
							req.body.email_address,
					},
				],
			},
		});
		if (user) {
			req.flash("errors", [
				{
					msg: "A user exists with the email address or with the display name",
				},
			]);
			return res.redirect("back");
		}
		User.create({
			display_name: req.body.display_name,
			email_address: req.body.email_address,
			password: bcrypt.hashSync(req.body.password, 10),
			token: uuidv4(),
		})
			.then((newUser) => {
				res.redirect("/auth/signin");
			})
			.catch((err) => next(err));
	} catch (err) {
		next(err);
	}
};

// const mg = mailgun({
// 	apiKey: process.env.MAIL_API_KEY,
// 	domain: process.env.DOMAIN_NAME,
// });
// const data = {
// 	from: `SoundBoard <welcome@${process.env.DOMAIN_NAME}>`,
// 	to: newUser.display_name,
// 	subject: "Email verification",
// 	text: `Hi ${newUser.display_name}👋, verify your account throught this link. http://localhost:8080/auth/verify/${user.token} `,
// };
// mg.messages().send(
// 	data,
// 	function (error, body) {
// 		if (error) {
// 			req.flash(
// 				"message",
// 				"Sorry, an error occured in sending your email."
// 			);
// 			res.redirect("back");
// 		} else {
// 			req.flash(
// 				"message",
// 				"We've sent you an email to verify your account. It may take a few minutess."
// 			);
// 			res.redirect(
// 				"/auth/signin"
// 			);
// 		}
// 	}
// );
