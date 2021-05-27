const bcrypt = require("bcrypt");

const db = require("../models/db");
const User = db.users;

exports.get = (req, res, next) => {
	User.findOne({
		where: {
			user_id: req.user.user_id,
		},
	})
		.then((user) => {
			if (!user) {
				return res.status(403).send();
			}
			res.render("profile", {
				email_address: user.email_address,
				display_name: user.display_name,
			});
		})
		.catch(next);
};

exports.updateName = async (req, res, next) => {
	try {
		let user = await User.findOne({
			where: {
				display_name: req.body.display_name,
			},
		});
		if (user && user.user_id != req.user.user_id) {
			req.flash("error", [
				{
					msg: "Display name is being used by someone.",
				},
			]);
			return res.redirect("back");
		}
		await User.update(
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

exports.updatePass = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.user.user_id);
		if (!user) return res.status(403).send(); //idk what to do here
		const result = bcrypt.compareSync(
			req.body.old_password,
			user.password
		);
		if (!result) {
			req.flash("error", [{ msg: "Incorrect password." }]);
			return res.redirect("back");
		}
		await User.update(
			{
				password: bcrypt.hashSync(
					req.body.password,
					10
				),
			},
			{
				where: {
					user_id: req.user.user_id,
				},
			}
		);
		req.flash("success", "Updated password.");
		res.redirect("back");
	} catch (err) {
		next(err);
	}
};
