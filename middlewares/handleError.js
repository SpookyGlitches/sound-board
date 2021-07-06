module.exports = function (err, req, res, next) {
	console.log(err);
	switch (err.name) {
		case "JsonWebTokenError":
		case "NotBeforeError":
		case "TokenExpiredError":
			req.flash("errors", [
				{
					msg: "The token is invalid. Try resending a new one by submitting up the form below.",
				},
			]);
			res.redirect("/account/verify/resend");
			break;
		default:
			res.status(500);
			return res.render("somethingBroke");
	}
};
