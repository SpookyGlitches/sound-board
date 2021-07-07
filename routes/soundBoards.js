const express = require("express");
const csrf = require("csurf");
const router = express.Router();

const csrfProtection = csrf();

const sboard = require("../controllers/soundBoardController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const validate = require("../validations/mw");
const soundBoardValidation = require("../validations/soundBoard");

const categoriesRouter = require("./categories");
const commentsRouter = require("./comments");

router.use(isAuthenticated);

router.get("/", sboard.index);

router.post(
	"/create",
	csrfProtection,
	validate(soundBoardValidation),
	sboard.create
);

router.post(
	"/:soundBoardId/edit",
	csrfProtection,
	validate(soundBoardValidation),
	sboard.update
);

router.get("/create", csrfProtection, sboard.getCreateEditPage);

router.get("/:soundBoardId/edit", csrfProtection, sboard.getCreateEditPage);

router.post("/:soundBoardId/delete", csrfProtection, sboard.destroy);

router.use("/:soundBoardId/categories", categoriesRouter);

router.use("/:soundBoardId/comments", commentsRouter);

module.exports = router;
