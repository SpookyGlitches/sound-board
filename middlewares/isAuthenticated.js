module.exports = function (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.flash("You must be signed in to access this resource.");
		return res.redirect("/auth/signin");
	}
};
