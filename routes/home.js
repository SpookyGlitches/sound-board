const express = require("express");
const router = express.Router();
const db = require("../models/db");

const SavedBoard = db.saved_boards;
const SoundBoard = db.boards;
const Category = db.categories;
const User = db.users;
const Comment = db.comments;

router.use((req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/auth/signin");
	}
});

router.get("/", async (req, res) => {
	let boardId = req.query.board;
	let sboard = null;
	if (!req.query.board) {
		try {
			const svboard = await SavedBoard.findOne({
				where: {
					user_id: req.user.user_id,
				},
			});
			if (svboard) {
				boardId = svboard.board_id;
			} else {
				return res.render("home", {
					sboard: null,
					isOp: false,
				});
			}
		} catch (err) {
			console.log(err);
			return res.status(500).send("sorry1");
		}
	}
	try {
		sboard = await SoundBoard.findOne({
			include: [
				{
					model: User,
					attributes: [
						"display_name",
						"user_id",
						"email_address",
					],
				},
				{
					model: Comment,
					include: [
						{
							model: User,
							attributes: [
								"display_name",
								"user_id",
							],
						},
					],
				},
				{
					model: Category,
				},
			],
			where: {
				board_id: boardId,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send("sorry2");
	}

	if (sboard == null || sboard.length == 0) {
		res.status(404).send("Board not found");
	} else {
		res.render("home", {
			sboard: sboard,
			isOp: req.user.user_id == sboard.user_id,
			user_id: req.user.user_id,
		});
	}
});

module.exports = router;
