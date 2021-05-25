const { Op } = require("sequelize");

const db = require("../models/db");

const SoundBoard = db.boards;
const SavedBoard = db.saved_boards;

exports.index = async (req, res, next) => {
	// i should've just used the sequelize pagination for this
	let offset = req.query.offset || 0;
	let filter = req.query.filter || "_%";
	try {
		const sboards = await SoundBoard.findAll({
			offset: parseInt(offset) || 0,
			limit: 5,
			where: {
				[Op.or]: [
					{
						tags: {
							[Op.substring]: filter,
						},
					},
					{
						name: {
							[Op.like]: filter,
						},
					},
				],
			},
		});
		res.render("explore", { sboards: sboards, offset: offset });
	} catch (err) {
		next(err);
	}
};

exports.create = async (req, res, next) => {
	const t = await db.sequelize.transaction();
	try {
		const sboard = await SoundBoard.create(
			{
				user_id: req.user.user_id,
				name: req.body.name,
				description: req.body.description,
				tags: req.body.tags,
			},
			{ transaction: t }
		);
		await SavedBoard.create(
			{
				user_id: req.user.user_id,
				board_id: sboard.board_id,
			},
			{ transaction: t }
		);
		await t.commit();
		res.redirect("/home");
	} catch (err) {
		await t.rollback();
		next(err);
	}
};

exports.update = (req, res, next) => {
	SoundBoard.update(
		{
			name: req.body.name,
			description: req.body.description,
			tags: req.body.tags,
		},
		{
			where: {
				user_id: req.user.user_id,
				board_id: req.params.soundBoardId,
			},
		}
	)
		.then((sboard) => {
			res.redirect("/home?board=" + req.params.soundBoardId);
		})
		.catch((err) => next(err));
};

exports.getCreateEditPage = (req, res, next) => {
	if (req.params.soundBoardId) {
		//this is an edit
		SoundBoard.findOne({
			where: {
				user_id: req.user.user_id,
				board_id: req.params.soundBoardId,
			},
		})
			.then((sboard) => {
				if (!sboard) {
					res.status(404).send(
						"Cannot find the soundboard."
					);
				} else {
					res.render("create", {
						sboard: sboard,
						title: "Edit",
					});
				}
			})
			.catch((err) => {
				next(err);
			});
	} else {
		//this is a create
		res.render("create", {
			sboard: {
				tags: null,
				board_id: null,
				name: null,
				description: null,
			},
			title: "Create",
		});
	}
};

exports.destroy = (req, res, next) => {
	const boardId = parseInt(req.params.soundBoardId);
	if (typeof boardId != "number") {
		return res.status(400).send("Bad request!");
	}
	SoundBoard.destroy({
		where: {
			board_id: boardId,
			user_id: req.user.user_id,
		},
	})
		.then((board) => {
			if (!board) {
				res.status(404).send(
					"Cannot find sound board to delete."
				);
			}
			res.redirect("/home");
		})
		.catch((err) => {
			next(err);
		});
};
