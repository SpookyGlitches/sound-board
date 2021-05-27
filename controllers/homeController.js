const db = require("../models/db");

const SavedBoard = db.saved_boards;
const SoundBoard = db.boards;
const Category = db.categories;
const User = db.users;
const Sound = db.sounds;
const Comment = db.comments;

exports.get = async (req, res, next) => {
	try {
		let boardId = req.query.board;
		let obj = { isSaved: true, user_id: req.user.user_id };
		if (!boardId) {
			//get one in saved boards since no queried board id
			let svboard = await SavedBoard.findOne({
				where: {
					user_id: obj.user_id,
				},
			});
			if (!svboard)
				return res.render("home", {
					sboard: null,
					isOp: false,
				});
			boardId = svboard.board_id;
		}
		//get the board, now that we're sure the boardId is supplied
		obj.sboard = await SoundBoard.findByPk(boardId, {
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
					include: [
						{
							model: Sound,
						},
					],
				},
			],
		});
		if (!obj.sboard)
			return res
				.status(404)
				.send("Cannot find the sound board.");
		obj.isOp = obj.user_id == obj.sboard.user_id;
		// diz bad code huhuhu
		if (!obj.isOp) {
			let aaa = await SavedBoard.findOne({
				where: {
					board_id: boardId,
					user_id: obj.user_id,
				},
			});
			obj.isSaved = aaa !== null;
		}
		res.render("home", obj);
	} catch (err) {
		next(err);
	}
};
