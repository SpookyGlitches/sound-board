const db = require("../models/db");
const Comment = db.comments;

exports.create = (req, res) => {
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
			}
			req.flash("success", "Successfully commented.");
			res.redirect("back");
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send("idk man");
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
			if (!comment) throw new Error();
			req.flash(
				"success",
				"Successfully deleted the comment."
			);
			res.redirect("back");
		})
		.catch((err) => {
			console.log(err);
			res.status(404).send("uh oh");
		});
};
