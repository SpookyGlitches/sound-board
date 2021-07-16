module.exports = function (req, res, next) {
	if (req.isAuthenticated()) {
		if (!req.user.verified_at) {
			req.flash("errors", [
				{
					msg: `Your email address is not verified. Check your email for the verification email or click resend below.`,
				},
			]);
			return res.redirect("/auth/signin");
		}
		next();
	} else {
		req.flash("You must be signed in to access this resource.");
		return res.redirect("/auth/signin");
	}
};
