const db = require("../models/db");
const User = db.users;
const jwt = require("jsonwebtoken");
const sendEmail = require("../helpers/email");
const { hash, compare } = require("bcrypt");

exports.verify = async (req, res, next) => {
	try {
		const decoded = jwt.verify(
			req.query.token,
			process.env.VERIFICATION_SECRET_KEY
		);
		const user = await User.findByPk(decoded.id);
		if (!user) {
			req.flash("errors", [
				{
					msg: "Cannot find the user.",
				},
			]);
			return res.redirect("/auth/signin");
		} else if (!user.verified_at) {
			user.verified_at = db.sequelize.literal("CURRENT_TIMESTAMP");
			await user.save();
		}
		req.flash("success", "Email verified!");
		res.redirect("/auth/signin");
	} catch (err) {
		next(err);
	}
};

exports.getVerificationPage = (req, res) => {
	res.render("accountTrouble", {
		title: "Resend Verification Email",
		route: "/account/verify/resend",
	});
};

exports.getResetPasswordPage = (req, res) => {
	res.render("accountTrouble", {
		title: "Reset Password",
		route: "/account/reset-password",
	});
};

exports.getChangePasswordPage = async (req, res, next) => {
	try {
		const decoded = jwt.verify(
			req.params.token,
			process.env.PASSWORD_SECRET_KEY
		);
		const user = await User.findOne({
			where: {
				email_address: decoded.email,
				password: decoded.password,
			},
		});
		if (!user) return res.status(404).send();
		res.render("changePassword", {
			email_address: decoded.email,
			token: req.params.token,
		});
	} catch (err) {
		next(err);
	}
};

exports.changePassword = async (req, res, next) => {
	try {
		const decoded = jwt.verify(
			req.body.token,
			process.env.PASSWORD_SECRET_KEY
		);
		const user = await User.findOne({
			where: {
				email_address: decoded.email,
			},
		});
		if (!user) return res.status(404).send();
		const password = await hash(req.body.password, 10);
		await user.update({ password: password });
		req.flash("success", "Successfully updated password");
		res.redirect("/auth/signin");
	} catch (err) {
		next(err);
	}
};

exports.sendResetPasswordLink = async (req, res, next) => {
	try {
		const { email_address, password, display_name } = await User.findOne({
			where: {
				email_address: req.body.email_address,
			},
		});
		if (email_address) {
			const token = jwt.sign(
				{ email: email_address, password: password },
				process.env.PASSWORD_SECRET_KEY,
				{ expiresIn: "30m" }
			);
			const resetPasswordRoute = `/account/reset-password/${token}`;
			await sendEmail(
				{ email_address: email_address, display_name: display_name },
				"RESET_PASSWORD",
				resetPasswordRoute
			);
		}
		req.flash("success", "Check your email for the reset password link.");
		res.redirect("back");
	} catch (err) {
		next(err);
	}
};

exports.resendVerification = async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: {
				email_address: req.body.email_address,
			},
		});
		if (user) {
			const token = jwt.sign(
				{ id: user.user_id, name: user.display_name },
				process.env.VERIFICATION_SECRET_KEY,
				{ expiresIn: "30m" }
			);
			const verifyEmailRoute = `/account/verify?token=${token}`;
			await sendEmail(
				{
					email_address: user.email_address,
					display_name: user.display_name,
				},
				"VERIFY_EMAIL",
				verifyEmailRoute
			);
		}
		req.flash("success", "Successfully resent the verification email.");
		res.redirect("back");
	} catch (err) {
		next(err);
	}
};

exports.updatePassword = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.user.user_id);
		if (!user) return res.status(403).send();
		const result = await compare(req.body.old_password, user.password);
		if (!result) {
			req.flash("errors", [{ msg: "Incorrect password." }]);
			return res.redirect("back");
		}
		const password = await hash(req.body.password, 10);
		await user.update(
			{
				password: password,
			},
			{
				where: {
					user_id: req.user.user_id,
				},
			}
		);
		const resetPasswordRoute = `/account/reset-password`;
		await sendEmail(
			{
				email_address: user.email_address,
				display_name: user.display_name,
			},
			"UPDATE_PASSWORD",
			resetPasswordRoute
		);
		req.flash("success", "Updated password.");
		res.redirect("back");
	} catch (err) {
		next(err);
	}
};

exports.get = (req, res, next) => {
	User.findOne({
		where: {
			user_id: req.user.user_id,
		},
	})
		.then((user) => {
			res.render("profile", {
				email_address: user.email_address,
				display_name: user.display_name,
			});
		})
		.catch(next);
};

exports.updateDisplayName = async (req, res, next) => {
	try {
		let user = await User.findOne({
			where: {
				display_name: req.body.display_name,
			},
		});
		if (user && user.user_id != req.user.user_id) {
			req.flash("errors", [
				{
					msg: "Display name is being used by someone.",
				},
			]);
			return res.redirect("back");
		}
		await user.update(
			{
				display_name: req.body.display_name,
			},
			{
				where: {
					user_id: req.user.user_id,
				},
			}
		);
		req.flash("success", "Successfully updated display name.");
		res.redirect("back");
	} catch (err) {
		next(err);
	}
};
