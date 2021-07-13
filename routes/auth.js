const express = require("express");
const csrf = require("csurf");
const router = express.Router();

const csrfProtection = csrf();

const auth = require("../controllers/authController");
const validate = require("../validations/mw.js");
const userValidations = require("../validations/user.js");

// i still haven't found a way to put csrf token in the navbar without using res.locals
router.post("/signout", auth.signout);

router.use(csrfProtection);

router.get("/signin", auth.getLoginPage);

router.get("/signup", auth.getSignupPage);

router.post("/signin", validate(userValidations.signin), auth.signin);

router.post("/signup", validate(userValidations.signup), auth.signup);

module.exports = router;
