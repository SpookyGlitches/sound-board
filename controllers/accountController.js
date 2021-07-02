const db = require("../models/db");
const User = db.users;
const jwt = require("jsonwebtoken");

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
		}
		user.verified_at = db.sequelize.literal("CURRENT_TIMESTAMP");
		await user.save();
		req.flash("success", "Email verified!");
		res.redirect("/auth/signin");
	} catch (err) {
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
	res.render("accountTrouble", { title: "Resend Verification Email" });
};

exports.resendVerification = (req, res) => {};
