const db = require("../models/db");

const SoundBoard = db.boards;
const Category = db.categories;
const User = db.users;
const Sound = db.sounds;

exports.create = async (req, res) => {
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
		if (!sboard) throw new Error("AAA");
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
		console.log(err);
		await t.rollback();
		res.status(500).send();
	}
};

exports.index = (req, res) => {
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
				return res.send("waley");
			}
			// res.json(sboard);
			console.log(sboard);
			res.render("category", {
				sboard: sboard,
			});
		})
		.catch((err) => {
			res.send(err);
		});
};

exports.update = (req, res) => {
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
			res.send("hoy");
			console.log(err);
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
				return res.status(404).send("not found");
			}
			res.redirect(
				`/home?boardId=${req.params.soundBoardId}`
			);
		})
		.catch((err) => {
			res.send("hoy");
			console.log(err);
		});
};
