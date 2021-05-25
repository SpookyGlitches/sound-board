const express = require("express");
const router = express.Router({
	mergeParams: true,
});

const comment = require("../controllers/commentController");

const validate = require("../validations/mw");
const commentValidation = require("../validations/comment");

router.post("/create", validate(commentValidation), comment.create);

router.post("/:commentId/delete", comment.destroy);

module.exports = router;
