const { v4: uuidv4 } = require("uuid");

const db = require("../models/db");

const Sound = db.sounds;
const SoundBoard = db.boards;

exports.create = [
	canModify,
	handleSoundUpload,
	(req, res, next) => {
		Sound.create({
			category_id: req.params.categoryId,
			label: req.body.label,
			description: req.body.description,
			file: req.body.sound,
		})
			.then((sound) => {
				if (!sound) {
					return res.send("error");
				}
				res.redirect("back");
			})
			.catch((err) => {
				next(err);
			});
	},
];

exports.getOne = (req, res) => {
	Sound.findOne({
		where: {
			sound_id: req.params.soundId,
			category_id: req.params.categoryId,
		},
	})
		.then((sound) => {
			if (!sound) res.status(404).send();
			else res.json(sound);
		})
		.catch((err) => {
			res.status(500).send();
		});
};

exports.update = [
	canModify,
	handleSoundUpload,
	async (req, res, next) => {
		try {
			const sboard = await SoundBoard.findOne({
				where: {
					user_id: req.user.user_id,
					board_id: req.params.soundBoardId,
				},
			});
			if (!sboard) {
				req.flash("errors", [
					{
						msg: "Cannot find the sound to update.",
					},
				]);
				return res.redirect("back");
			}
			let obj = {
				label: req.body.label,
				description: req.body.description,
			};
			if (req.body.sound) {
				obj.file = req.body.sound;
			}
			await Sound.update(obj, {
				where: {
					sound_id: req.params.soundId,
				},
			});
			req.flash(
				"success",
				"Successfully updated sound details."
			);
			res.redirect("back");
		} catch (err) {
			next(err);
		}
	},
];

exports.destroy = [
	canModify,
	(req, res) => {
		Sound.destroy({
			where: {
				sound_id: req.params.soundId,
				category_id: req.params.categoryId,
			},
		})
			.then((sound) => {
				if (!sound) {
					req.flash("errors", [
						{
							msg: "Cannot find the sound to delete.",
						},
					]);
				} else {
					req.flash(
						"success",
						"Successfully deleted the sound."
					);
				}
				//sequelize only returns the number of rows deleted, bruh.
				// fs.unlinkSync("./public/sounds/" + sound.file);
				res.redirect("back");
			})
			.catch((err) => {
				next(err);
			});
	},
];

function canModify(req, res, next) {
	SoundBoard.findOne({
		where: {
			user_id: req.user.user_id,
			board_id: req.params.soundBoardId,
		},
	})
		.then((sboard) => {
			if (!sboard) {
				return res
					.status(404)
					.send("Cannot find the sound board");
			}
			next();
		})
		.catch((err) => {
			next(err);
		});
}

function handleSoundUpload(req, res, next) {
	if (req.files && req.files.length != 0) {
		const sound = req.files.sound;
		const fileName = uuidv4() + sound.name;
		sound.mv("./public/sounds/" + fileName)
			.then(() => {
				req.body.sound = fileName;
				next();
			})
			.catch((err) => {
				next(err);
			});
	} else {
		if (!req.params.soundId) {
			req.flash("errors", [{ msg: "Upload a sound file." }]);
			res.redirect("back");
		} else {
			next();
		}
	}
}
