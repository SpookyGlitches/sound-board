const express = require("express");
const router = express.Router();

const comment = require("../controllers/commentController");
const validate = require("../validations/mw");
const commentValidation = require("../validations/comment");

router.post("/create", comment.create);

router.get("/", comment.index);

router.post("/:commentId/delete", comment.destroy);

module.exports = router;
