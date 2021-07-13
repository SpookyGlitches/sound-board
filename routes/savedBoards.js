const express = require("express");
const csrf = require("csurf");
const router = express.Router();

const csrfProtection = csrf();
const svboard = require("../controllers/savedBoardController");

const isAuthenticated = require("../middlewares/isAuthenticated");

router.use(isAuthenticated);

router.get("/", svboard.index);

router.use(csrfProtection);

router.post("/create/:soundBoardId", svboard.create);

router.post("/delete/:soundBoardId", svboard.destroy);

module.exports = router;
