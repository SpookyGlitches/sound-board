const SavedBoards = require("../models/saved_board");

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
