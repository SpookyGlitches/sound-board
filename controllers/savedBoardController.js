const SavedBoards = require("../models/db").saved_boards;

exports.index = async (req, res) => {
	try {
		const savedBoards = await SavedBoards.findAll({
			where: {
				user_id: req.user.user_id,
			},
			order: [["is_pinned", "DESC"]],
		});
		res.json(savedBoards);
	} catch (err) {
		console.log(err);
		res.status(500).send();
	}
};
