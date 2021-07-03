const db = require("../models/db");
const User = db.users;
const jwt = require("jsonwebtoken");
const {
	sendVerificationEmail,
	sendResetPasswordEmail,
} = require("./helpers/email");

exports.verify = async (req, res, next) => {
	try {
		const decoded = jwt.verify(
			req.query.token,
			process.env.VERIFICATION_SECRET_KEY
		);
		console.log(decoded);
		const user = await User.findByPk(decoded.id);
		if (!user) {
			req.flash("errors", [
				{
					msg: "Cannot find the user.",
				},
			]);
			return res.redirect("/auth/signin");
		}
		user.verified_at = db.sequelize.literal("CURRENT_TIMESTAMP");
		await user.save();
		req.flash("success", "Email verified!");
		res.redirect("/auth/signin");
	} catch (err) {
		console.log(err);
		const msg = err.name;
		if (
			msg == "JsonWebTokenError" ||
			msg == "NotBeforeError" ||
			msg == "TokenExpiredError"
		) {
			req.flash("errors", [
				{
					msg: "The token is invalid. Try resending a new one by submitting up the form below.",
				},
			]);
			res.redirect("/account/verify/resend");
		} else {
			next(err);
		}
	}
};

exports.getVerificationPage = (req, res, next) => {
	res.render("accountTrouble", {
		title: "Resend Verification Email",
		route: "/account/verify/resend",
	});
};

exports.getResetPasswordPage = (req, res, next) => {
	res.render("accountTrouble", {
		title: "Reset Password",
		route: "/account/reset-password",
	});
};

// exports.getChangePasswordPage = (req, res, next) => {
// 	try{
// 		const decoded = jwt.verify(
// 			req.query.token,
// 			process.env.VERIFICATION_SECRET_KEY
// 		);
// 	}catch(err){

// 	}

// 	res.render("changePassword", { token: req.params.token });
// };

// exports.changePassword = (req,res) => {
// 	try{

// 	}
// }

exports.sendResetPasswordLink = async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: {
				email_address: req.body.email_address,
			},
		});
		if (user) {
			const token = jwt.sign(
				{ email: user.email_address },
				process.env.RESET_PASSWORD_SECRET_KEY,
				{ expiresIn: "30m" }
			);
			await sendResetPasswordEmail(
				user.email_address,
				user.display_name,
				token
			);
		}
		req.flash("success", "Check your email for the reset password link.");
		res.redirect("back");
	} catch (err) {
		next(err);
	}
};

exports.recover = async (req, res) => {
	try {
		const user = await User.findOne({
			where: {
				email_address: req.body.email_address,
			},
		});
		if (user) {
			const token = jwt.sign(
				{ password: user.password, name: user.display_name },
				process.env.VERIFICATION_SECRET_KEY,
				{ expiresIn: "30m" }
			);
			await sendVerificationEmail(
				user.email_address,
				user.display_name,
				token
			);
		}
		req.flash("success", "Successfully resent the verification email.");
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
			await sendVerificationEmail(
				user.email_address,
				user.display_name,
				token
			);
		}
		req.flash("success", "Successfully resent the verification email.");
		res.redirect("back");
	} catch (err) {
		next(err);
	}
};
