const express = require("express");
const router = express.Router();
const SoundBoard = require("../models/board");
const SavedBoard = require("../models/saved_board");

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
			if (svboard.length != 0) {
				boardId = svboard.board_id;
			} else {
				return res.render("home", {
					sboard: null,
					isOp: false,
				});
			}
		} catch (err) {
			return res.status(500).send();
		}
	}
	try {
		sboard = await SoundBoard.findOne({
			where: {
				board_id: boardId,
			},
		});
	} catch (err) {
		return res.status(500).send();
	}

	if (sboard == null || sboard.length == 0) {
		res.status(404).send("Board not found");
	} else {
		res.render("home", {
			sboard: sboard,
			isOp: req.user.user_id == sboard.user_id,
		});
	}
});

module.exports = router;
