const db = require("../models/db");
const Comment = db.comments;

exports.create = (req, res, next) => {
	Comment.create({
		user_id: req.user.user_id,
		board_id: req.params.soundBoardId,
		content: req.body.content,
	})
		.then((comment) => {
			if (!comment) {
				req.flash("errors", {
					msg: "Unable to create comment.",
				});
			} else {
				req.flash("success", "Successfully commented.");
			}
			res.redirect("back");
		})
		.catch((err) => {
			next(err);
		});
};

exports.destroy = (req, res) => {
	Comment.destroy({
		where: {
			user_id: req.user.user_id,
			comment_id: req.params.commentId,
		},
	})
		.then((comment) => {
			req.flash(
				"success",
				"Successfully deleted the comment."
			);
			res.redirect("back");
		})
		.catch((err) => {
			next(err);
		});
};
