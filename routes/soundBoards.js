const express = require("express");
const router = express.Router();

const sboard = require("../controllers/soundBoardController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const validate = require("../validations/mw");
const soundBoardValidation = require("../validations/soundBoard");

const categoriesRouter = require("./categories");
const commentsRouter = require("./comments");

router.use(isAuthenticated);

router.get("/", sboard.index);

router.post("/create", validate(soundBoardValidation), sboard.create);

router.post(
	"/:soundBoardId/edit",
	validate(soundBoardValidation),
	sboard.update
);

router.get("/create", sboard.getCreateEditPage);

router.get("/:soundBoardId/edit", sboard.getCreateEditPage);

router.post("/:soundBoardId/delete", sboard.destroy);

router.use("/:soundBoardId/categories", categoriesRouter);

router.use("/:soundBoardId/comments", commentsRouter);

module.exports = router;
