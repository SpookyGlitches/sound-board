const express = require("express");
const csrf = require("csurf");
const router = express.Router({
	mergeParams: true,
});
const csrfProtection = csrf();

const comment = require("../controllers/commentController");

const validate = require("../validations/mw");
const commentValidation = require("../validations/comment");

router.use(csrfProtection);

router.post("/create", validate(commentValidation), comment.create);

router.post("/:commentId/delete", comment.destroy);

module.exports = router;
