require("dotenv").config();

const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const db = require("../models/db");
const sendEmail = require("../helpers/email");

const User = db.users;

exports.getLoginPage = (req, res) => {
	res.render("signIn", { error: req.flash("error") });
};

exports.getSignupPage = (req, res) => {
	res.render("signUp");
};

exports.signin = [
	passport.authenticate("local", {
		failureRedirect: "/auth/signin",
		failureFlash: true,
	}),
	(req, res, next) => {
		User.findByPk(req.user.user_id)
			.then((user) => {
				if (!user) throw new Error();
				if (!user.verified_at) {
					req.flash("errors", [
						{
							msg: `Your email address is not verified. Click the link on the email that we've sent to you to verify your email or click resend verification email located below.`,
						},
					]);
					return res.redirect("back");
				}
				res.redirect("/home");
			})
			.catch((err) => {
				next(err);
			});
	},
];

exports.signout = (req, res) => {
	req.logout();
	res.redirect("/auth/signin");
};

exports.signup = async (req, res, next) => {
	const t = await db.sequelize.transaction();

	try {
		let user = await User.findOne({
			where: {
				[Op.or]: [
					{
						display_name: req.body.display_name,
					},
					{
						email_address: req.body.email_address,
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
		const newUser = await User.create(
			{
				display_name: req.body.display_name,
				email_address: req.body.email_address,
				password: bcrypt.hashSync(req.body.password, 10),
				token: uuidv4(),
			},
			{ transaction: t }
		);
		const token = jwt.sign(
			{ id: newUser.user_id, name: newUser.display_name },
			process.env.VERIFICATION_SECRET_KEY,
			{ expiresIn: "30m" }
		);
		const verifyEmailRoute = `/account/verify?token=${token}`;
		await sendEmail(
			{
				display_name: newUser.display_name,
				email_address: newUser.email_address,
			},
			"VERIFY_EMAIL",
			verifyEmailRoute
		);
		await t.commit();
		req.flash("success", "We've sent you a link to verify your email!");
		res.redirect("back");
	} catch (err) {
		await t.rollback();
		next(err);
	}
};
