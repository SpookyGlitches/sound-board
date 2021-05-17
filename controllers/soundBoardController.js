const SoundBoard = require("../models/board");
const SavedBoard = require("../models/saved_board");

const sequelize = require("../config/connection");
// exports.index = (req, res) => {};

exports.create = async (req, res) => {
	const t = await sequelize.transaction();
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
