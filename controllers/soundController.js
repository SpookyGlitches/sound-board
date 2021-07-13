require("dotenv/config");

const { v4: uuidv4, v4 } = require("uuid");
const { uploadObject, deleteObject, getObject } = require("../helpers/s3");
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
				res.redirect(
					`/soundboards/${req.params.soundBoardId}/categories/${req.params.categoryId}`
				);
			})
			.catch(next);
	},
];

exports.play = async (req, res, next) => {
	try {
		const data = await getObject(req.query.key);
		data.Body.pipe(res);
	} catch (err) {
		next(err);
	}
};

exports.getOne = (req, res, next) => {
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
		.catch(next);
};

exports.update = [
	canModify,
	handleSoundUpload,
	async (req, res, next) => {
		try {
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
			req.flash("success", "Successfully updated sound details.");
			res.redirect("back");
		} catch (err) {
			next(err);
		}
	},
];

exports.destroy = [
	canModify,
	async (req, res, next) => {
		try {
			const sound = await Sound.findOne({
				where: {
					sound_id: req.params.soundId,
					category_id: req.params.categoryId,
				},
			});
			if (!sound) return res.status(404).send();
			await deleteObject(sound.file);
			await sound.destroy();
			req.flash("success", "Successfully deleted.");
			res.redirect(
				`/soundboards/${req.params.soundBoardId}/categories/${req.params.categoryId}`
			);
		} catch (err) {
			next(err);
		}
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
				return res.status(404).send("Cannot find the sound board");
			}
			next();
		})
		.catch((err) => {
			next(err);
		});
}

async function handleSoundUpload(req, res, next) {
	if (req.files && req.files.length != 0) {
		const catId = req.params.categoryId;
		const sboardId = req.params.soundBoardId;
		//either an edit or a create
		try {
			let fileName;
			if (req.params.soundId) {
				//delete previous file since this is an edit
				const sound = await Sound.findByPk(req.params.soundId);
				if (!sound) return res.status(404).send();
				await deleteObject(sound.file);
				fileName = sound.file;
			} else {
				fileName = generateFileName(
					sboardId,
					catId,
					req.files.sound.name
				);
			}
			await uploadObject(req.files.sound.data, fileName);
			req.body.sound = fileName;
			next();
		} catch (err) {
			next(err);
		}
	} else {
		if (!req.params.soundId) {
			req.flash("errors", [{ msg: "Upload a sound file." }]);
			res.redirect("back");
		} else {
			next();
		}
	}
}

function generateFileName(soundBoardId, categoryId, name) {
	const myFile = name.split(".");
	const fileType = myFile[myFile.length - 1];
	const rand = v4() + "." + fileType;
	return `${soundBoardId}/${categoryId}/${rand}`;
}
