// const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const db = require("../models/db");

const Sound = db.sounds;
const SoundBoard = db.boards;

exports.create = [
	canModify,
	handleSoundUpload,
	(req, res) => {
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
				return res.redirect("back");
			})
			.catch((err) => {
				return res.status(500).send();
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
			res.status(400).send();
		});
};

exports.update = [
	canModify,
	handleSoundUpload,
	async (req, res) => {
		try {
			const sboard = await SoundBoard.findOne({
				where: {
					user_id: req.user.user_id,
					board_id: req.params.soundBoardId,
				},
			});
			if (!sboard) throw new Error();
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
			res.send(
				`Not found ${req.params.soundBoardId} and ${req.params.soundId}`
			);
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
				if (!sound) throw new Error();
				//sequelize only returns the number of rows deleted, bruh.
				// fs.unlinkSync("./public/sounds/" + sound.file);
				req.flash(
					"success",
					"Successfully deleted the sound."
				);
				res.redirect("back");
			})
			.catch((err) => {
				console.log(err);
				res.send("Something went wrong");
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
				throw new Error();
			}
			next();
		})
		.catch((err) => {
			return res.status(403).send("Unauthorized access");
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
				return res.status(500).send();
			});
	} else {
		if (!req.params.soundId) {
			return res.send("Upload a file");
		} else {
			console.log("here");
			next();
		}
	}
}
