const { v4: uuidv4 } = require("uuid");
const db = require("../models/db");

const Sound = db.sounds;

exports.create = (req, res) => {
	const sound = req.files.sound;
	const fileName = uuidv4() + sound.name;
	sound.mv("./public/sounds/" + fileName)
		.then(() => {
			Sound.create({
				category_id: req.params.categoryId,
				label: req.body.label,
				description: req.body.description,
				file: fileName,
			}).then((sound) => {
				if (!sound) {
					return res.send("error");
				}
				return res.redirect("back");
			});
		})
		.catch((err) => {
			console.log(err);
			res.send("error");
		});
};
