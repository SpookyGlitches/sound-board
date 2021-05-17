const SavedBoards = require("../models/saved_boards");

exports.home = async (req, res) => {
	try {
		const savedBoards = await SavedBoards.findAll({
			where: {
				user_id: req.user.user_id,
			},
			order: ["is_pinned", "DESC"],
		});
	} catch (err) {}
};
