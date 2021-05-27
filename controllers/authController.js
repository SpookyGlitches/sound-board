require("dotenv").config();

const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const passport = require("passport");
const { v4: uuidv4 } = require("uuid");

const db = require("../models/db");
const User = db.users;

exports.getLoginPage = (req, res) => {
	res.render("signIn", { error: req.flash("error") });
};

exports.getSignupPage = (req, res) => {
	res.render("signUp");
};

exports.signin = passport.authenticate("local", {
	successRedirect: "/home",
	failureRedirect: "/auth/signin",
	failureFlash: true,
});

exports.signout = (req, res) => {
	req.logout();
	res.redirect("/auth/signin");
};

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
			if (user.display_name == req.body.display_name) {
				req.flash("errors", [
					{
						msg: "The display name already exists. Try another one.",
					},
				]);
			} else {
				req.flash("errors", [
					{
						msg: "A user exists with that email address.",
					},
				]);
			}
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
