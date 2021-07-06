const express = require("express");
const router = express.Router();

const home = require("../controllers/homeController");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.get("/", isAuthenticated, home.get);

module.exports = router;
