const express = require("express");
const router = express.Router();

const sboard = require("../controllers/soundBoardController");
const validate = require("../validations/mw.js");
const soundBoardValidation = require("../validations/soundBoard.js");

// router.get("/", sboard.index);

router.post("/create", sboard.create);

// router.get("/:soundBoardId", sboard.getOne);

router.get("/create", sboard.getCreatePage);

// router.get("/:soundBoardId/edit", sboard.update);

// router.post("/:soundBoardId/delete", sboard.destroy);

module.exports = router;
