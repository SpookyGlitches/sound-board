const db = require("../models/db");
const SavedBoard = db.saved_boards;
const SoundBoard = db.boards;

exports.index = async (req, res) => {
	try {
		const savedBoards = await SavedBoard.findAll({
			where: {
				user_id: req.user.user_id,
			},
			include: [
				{
					model: SoundBoard,
				},
			],
			order: [["is_pinned", "DESC"]],
		});
		res.json(savedBoards);
	} catch (err) {
		console.log(err);
		res.status(500).send();
	}
};

exports.create = async (req, res) => {
	try {
		const svboards = await SavedBoard.findOne({
			where: {
				user_id: req.user.user_id,
				board_id: req.params.soundBoardId,
			},
		});
		if (svboards && svboards.length != 0) {
			throw new Error("Existing");
		}
		await SavedBoard.create({
			user_id: req.user.user_id,
			board_id: req.params.soundBoardId,
		});
		req.flash("success", "Saved!");
		res.redirect("back");
	} catch (err) {
		res.send(err);
	}
};
