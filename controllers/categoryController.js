const db = require("../models/db");

const SoundBoard = db.boards;
const Category = db.categories;
const Sound = db.sounds;

const { s3Client } = require("../config/s3Client.js"); // Helper function that creates Amazon S3 service client module.
const {
	DeleteObjectsCommand,
	ListObjectsCommand,
} = require("@aws-sdk/client-s3");

exports.create = async (req, res, next) => {
	try {
		const boardId = req.params.soundBoardId;
		const sboard = await SoundBoard.findOne({
			where: {
				user_id: req.user.user_id,
				board_id: boardId,
			},
		});
		if (!sboard)
			return res
				.status(404)
				.send("Cannot find sound board to create category.");
		const category = await Category.create({
			board_id: boardId,
			name: req.body.name,
			description: req.body.description,
		});
		res.redirect(
			`/soundboards/${boardId}/categories/${category.category_id}`
		);
	} catch (err) {
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
				where: {
					category_id: req.params.categoryId,
				},
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
				return res.status(404).send("Category not found");
			}
			res.render("category", {
				sboard: sboard,
				isOp: sboard.user_id == req.user.user_id,
				csrfToken: req.csrfToken(),
			});
		})
		.catch(next);
};

exports.update = (req, res, next) => {
	const sboardId = req.params.soundBoardId;
	const catId = req.params.categoryId;
	Category.update(
		{
			name: req.body.name,
			description: req.body.description,
		},
		{
			where: {
				board_id: sboardId,
				category_id: catId,
			},
			include: [
				{
					model: SoundBoard,
					where: {
						board_id: sboardId,
						user_id: req.user.user_id,
					},
				},
			],
		}
	)
		.then((sboard) => {
			if (!sboard) {
				return res.status(404).send("Cannot find category to update.");
			}
			res.redirect(`/soundboards/${sboardId}/categories/${catId}`);
		})
		.catch(next);
};

exports.destroy = async (req, res, next) => {
	try {
		let bucketParams = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: `${req.params.soundBoardId}/${req.params.categoryId}/`,
		};
		const { Contents } = await s3Client.send(
			new ListObjectsCommand(bucketParams)
		);
		bucketParams.Delete = { Objects: Contents };
		delete bucketParams.Key;
		await s3Client.send(new DeleteObjectsCommand(bucketParams));
		await Category.destroy({
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
		});
		res.redirect(`/home?board=${req.params.soundBoardId}`);
	} catch (err) {
		next(err);
	}
};
