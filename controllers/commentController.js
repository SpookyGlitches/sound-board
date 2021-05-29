const db = require("../models/db");
const Comment = db.comments;

exports.create = (req, res, next) => {
	Comment.create({
		user_id: req.user.user_id,
		board_id: req.params.soundBoardId,
		content: req.body.content,
	})
		.then((comment) => {
			req.flash("success", "Successfully commented.");
			res.redirect("back");
		})
		.catch(next);
};

exports.destroy = (req, res, next) => {
	Comment.destroy({
		where: {
			user_id: req.user.user_id,
			comment_id: req.params.commentId,
		},
	})
		.then((comment) => {
			req.flash("success", "Successfully deleted the comment.");
			res.redirect("back");
		})
		.catch(next);
};
