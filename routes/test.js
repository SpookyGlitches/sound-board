const express = require("express");
const router = express.Router();
const db = require("../models/db");
const User = db.users;
const SoundBoard = db.boards;

router.use((req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/auth/signin");
	}
});

router.get("/", (req, res) => {
	SoundBoard.findAll({
		include: [
			{
				model: User,
				attributes: [
					"user_id",
					"display_name",
					"email_address",
				],
			},
		],
		where: {
			user_id: req.user.user_id,
		},
	})
		.then((sboards) => res.json(sboards))
		.catch((err) => {
			console.log(err);
			res.send(err);
		});
});

module.exports = router;
