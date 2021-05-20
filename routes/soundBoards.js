const express = require("express");
const router = express.Router();

const sboard = require("../controllers/soundBoardController");
const validate = require("../validations/mw");
const soundBoardValidation = require("../validations/soundBoard");

router.use((req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/auth/signin");
	}
});

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

router.use("/:soundBoardId/categories", require("./categories"));

module.exports = router;
