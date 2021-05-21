const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/db").users;

const customFields = {
	usernameField: "email_address",
	passwordField: "password",
};

passport.use(
	new LocalStrategy(customFields, async function (email, password, done) {
		try {
			let user = await User.findOne({
				where: {
					email_address: email,
				},
			});
			if (!user) {
				return done(null, false, {
					message: "No account associated with that email address",
				});
			}
			const result = bcrypt.compareSync(
				password,
				user.password
			);
			// const result = validatePassword(user, password);
			if (result == false) {
				return done(null, false, {
					message: "Incorrect password.",
				});
			} else {
				console.log("HEEEEEEE");
			}
			return done(null, user);
		} catch (err) {
			done(err);
		}
	})
);

passport.serializeUser(function (user, done) {
	done(null, {
		user_id: user.user_id,
		display_name: user.display_name,
		email_address: user.email_address,
	});
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

// function validatePassword(user, password) {
// 	console.log(user);
// 	console.log(password);

// 	bcrypt.compare(password, user.password)
// 		.then(function (result) {
// 			return result;
// 		})
// 		.catch((err) => {
// 			return false;
// 		});
// }

module.exports = passport;
