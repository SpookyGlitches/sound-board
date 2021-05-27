const express = require("express");
const router = express.Router();

const profile = require("../controllers/profileController");

const validate = require("../validations/mw");
const userValidation = require("../validations/user");

router.get("/", profile.get);

//forgive me father for i have sinned

router.post(
	"/update/name",
	validate([userValidation.signup[1]]),
	profile.updateName
);

router.post(
	"/update/password",
	validate([userValidation.signup[2], userValidation.signup[3]]),
	profile.updatePass
);

module.exports = router;
