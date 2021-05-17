const express = require("express");
const router = express.Router();

const svboard = require("../controllers/savedBoardController");
const validate = require("../validations/mw");
const svboardValidation = require("../validations/savedBoard");

// router.post("/create", svboard.create);

router.get("/", svboard.index);

// router.post("/:savedBoardId/update", svboard.update);

// router.post("/:savedBoardId/delete", svboard.destroy);

module.exports = router;
