const db = require("../models/db");

const SoundBoard = db.boards;
const Category = db.categories;
const User = db.users;
const Sound = db.sounds;

exports.create = async (req, res, next) => {
	const t = await db.sequelize.transaction();
	try {
		const boardId = req.params.soundBoardId;
		const sboard = await SoundBoard.findOne(
			{
				where: {
					user_id: req.user.user_id,
					board_id: boardId,
				},
			},
			{ transaction: t }
		);
		if (!sboard) throw new Error();
		const category = await Category.create(
			{
				board_id: boardId,
				name: req.body.name,
				description: req.body.description,
			},
			{ transaction: t }
		);
		await t.commit();
		return res.redirect(
			`/soundboards/${boardId}/categories/${category.category_id}`
		);
	} catch (err) {
		await t.rollback();
		next(err);
	}
};

exports.index = (req, res, next) => {
	SoundBoard.findOne({
		where: {
			board_id: req.params.soundBoardId,
		},
		include: [
			{
				model: Category,
				include: [
					{
						model: Sound,
					},
				],
			},
		],
	})
		.then((sboard) => {
			if (!sboard) {
				return res.send("Category not found");
			}
			res.render("category", {
				sboard: sboard,
				isOp: sboard.user_id == req.user.user_id,
			});
		})
		.catch((err) => {
			next(err);
		});
};

exports.update = (req, res, next) => {
	Category.update(
		{
			name: req.body.name,
			description: req.body.description,
		},
		{
			where: {
				board_id: req.params.soundBoardId,
				category_id: req.params.categoryId,
			},
			include: [
				{
					model: SoundBoard,
					where: {
						board_id: req.params
							.soundBoardId,
						user_id: req.user.user_id,
					},
				},
			],
		}
	)
		.then((sboard) => {
			if (!sboard) {
				return res.status(404).send("not found");
			}
			res.redirect("back");
		})
		.catch((err) => {
			next(err);
		});
};

exports.destroy = (req, res) => {
	Category.destroy({
		where: {
			category_id: req.params.categoryId,
			board_id: req.params.soundBoardId,
		},
		include: [
			{
				model: SoundBoard,
				where: {
					board_id: req.params.soundBoardId,
					user_id: req.user.user_id,
				},
			},
		],
	})
		.then((category) => {
			if (!category) {
				return res
					.status(404)
					.send("Category not found");
			}
			res.redirect(`/home?board=${req.params.soundBoardId}`);
		})
		.catch((err) => {
			next(err);
		});
};
