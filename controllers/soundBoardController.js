const {
	DeleteObjectsCommand,
	ListObjectsCommand,
} = require("@aws-sdk/client-s3");
const { Op } = require("sequelize");
const { s3Client } = require("../config/s3Client");
const { deleteObjects } = require("../helpers/s3");

const db = require("../models/db");

const SoundBoard = db.boards;
const SavedBoard = db.saved_boards;

exports.index = async (req, res, next) => {
	try {
		const limit = 5;
		const filter = req.query.filter || "_%";
		let page = parseInt(req.query.page) || 0;
		page = page <= 0 ? 0 : page - 1;
		const { count, rows } = await SoundBoard.findAndCountAll({
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
			offset: page * limit,
			limit: limit,
		});
		res.render("explore", { sboards: rows, count: count, limit: limit });
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
		res.redirect("/home?board=" + sboard.board_id);
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
					res.status(404).send("Cannot find the soundboard.");
				} else {
					res.render("create", {
						sboard: sboard,
						title: "Edit",
						csrfToken: req.csrfToken(),
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
			csrfToken: req.csrfToken(),
		});
	}
};

exports.destroy = async (req, res, next) => {
	try {
		await SoundBoard.destroy({
			where: {
				board_id: req.params.soundBoardId,
				user_id: req.user.user_id,
			},
		});
		await deleteObjects(`${req.params.soundBoardId}/`);
		res.redirect("/home");
	} catch (err) {
		next(err);
	}
};
