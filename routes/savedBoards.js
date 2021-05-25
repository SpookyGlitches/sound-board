const express = require("express");
const router = express.Router();

const svboard = require("../controllers/savedBoardController");

// const validate = require("../validations/mw");
// const svboardValidation = require("../validations/savedBoard");

router.post("/create/:soundBoardId", svboard.create);

router.get("/", svboard.index);

// router.post("/:savedBoardId/delete", svboard.destroy);

module.exports = router;
