const { Op } = require("sequelize");

const db = require("../models/db");

const SoundBoard = db.boards;
const SavedBoard = db.saved_boards;

exports.index = async (req, res) => {
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
		console.error(err);
		res.send("eror");
	}
};

exports.create = async (req, res) => {
	const t = await db.sequelize.transaction();
	try {
		console.log(req.body.tags);
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
		res.status(404).send("sorry");
	}
};

// exports.getOne = (req, res) => {};

exports.update = (req, res) => {
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
			if (!sboard) {
				res.status(404).send("Unable to update row");
			} else {
				res.redirect(
					"/home?board=" + req.params.soundBoardId
				);
			}
		})
		.catch((err) => res.status(500).send("boom"));
};

exports.getCreateEditPage = (req, res) => {
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
					throw new Error();
				} else {
					return res.render("create", {
						sboard: sboard,
						title: "Edit",
					});
				}
			})
			.catch((err) => {
				return res.status(404).send();
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

exports.destroy = (req, res) => {
	const boardId = parseInt(req.params.soundBoardId);
	if (typeof boardId != "number") {
		return res.status(400).send();
	}
	SoundBoard.destroy({
		where: {
			board_id: boardId,
			user_id: req.user.user_id,
		},
	})
		.then((board) => {
			if (!board) {
				res.status(404).send("404");
			}
			res.redirect("/home");
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send("idk");
		});
};
