const sequelize = require("../config/connection");
const { Op, DataTypes } = require("sequelize");

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
		console.log(err);
		res.status(404).send("sorry");
	}
};

// exports.getOne = (req, res) => {};

// exports.update = (req, res) => {};

// exports.destroy = (req, res) => {};

exports.getCreatePage = (req, res) => {
	res.render("create");
};
