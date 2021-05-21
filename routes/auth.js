const express = require("express");
const router = express.Router();

const auth = require("../controllers/authController");
const validate = require("../validations/mw.js");
const userValidations = require("../validations/user.js");

router.get("/signin", auth.getLoginPage);

router.get("/signup", auth.getSignupPage);

router.post("/signin", validate(userValidations.signin), auth.signin);

router.post("/signup", validate(userValidations.signup), auth.signup);

router.get("/signout", auth.signout);

module.exports = router;
