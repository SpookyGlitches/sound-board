const db = require("../models/db");
const SavedBoard = db.saved_boards;
const SoundBoard = db.boards;

exports.index = async (req, res, next) => {
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
		next(err);
	}
};

exports.create = async (req, res, next) => {
	try {
		const svboards = await SavedBoard.findOne({
			where: {
				user_id: req.user.user_id,
				board_id: req.params.soundBoardId,
			},
		});
		if (svboards && svboards.length != 0) {
			req.flash("error", "Sound board is already saved.");
		} else {
			req.flash("success", "Saved!");
		}
		await SavedBoard.create({
			user_id: req.user.user_id,
			board_id: req.params.soundBoardId,
		});
		res.redirect("back");
	} catch (err) {
		next(err);
	}
};
