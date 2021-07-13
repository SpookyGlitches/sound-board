const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const csrfProtection = csrf();
const home = require("../controllers/homeController");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.get("/", isAuthenticated, csrfProtection, home.get);

module.exports = router;
