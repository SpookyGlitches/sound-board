require("dotenv/config");

const { v4: uuidv4, v4 } = require("uuid");
const { s3Client } = require("../config/s3Client.js"); // Helper function that creates Amazon S3 service client module.
const {
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
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
				res.redirect("back");
			})
			.catch(next);
	},
];

exports.play = async (req, res, next) => {
	const downloadParams = {
		Key: req.params.key,
		Bucket: process.env.AWS_BUCKET_NAME,
	};
	try {
		let data = await s3Client.send(new GetObjectCommand(downloadParams));
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
			await deleteAWSObject(sound.file);
			await sound.destroy();
			req.flash("success", "Successfully deleted.");
			res.redirect("back");
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
		//either an edit or a create
		try {
			let fileName;
			if (req.params.soundId) {
				//delete previous file since this is an edit
				const sound = await Sound.findByPk(req.params.soundId);
				if (!sound) return res.status(404).send();
				await deleteAWSObject(sound.file);
				fileName = sound.file;
			} else {
				fileName = generateFileName(req.files.sound.name);
			}
			const uploadParams = {
				Body: req.files.sound.data,
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: fileName,
			};
			await s3Client.send(new PutObjectCommand(uploadParams));
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

async function deleteAWSObject(key) {
	const bucketParams = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key,
	};
	await s3Client.send(new DeleteObjectCommand(bucketParams));
}

function generateFileName(name) {
	const myFile = name.split(".");
	const fileType = myFile[myFile.length - 1];
	return v4() + "." + fileType;
}
