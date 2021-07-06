const express = require("express");
const router = express.Router();

const svboard = require("../controllers/savedBoardController");

const isAuthenticated = require("../middlewares/isAuthenticated");

router.use(isAuthenticated);

router.post("/create/:soundBoardId", svboard.create);

router.get("/", svboard.index);

router.post("/delete/:soundBoardId", svboard.destroy);

module.exports = router;
