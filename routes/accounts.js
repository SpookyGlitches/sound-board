const express = require("express");
const router = express.Router();

const account = require("../controllers/accountController");

// const validate = require("../validations/mw.js");
// const userValidations = require("../validations/user.js");

// router.get("/", account.get);

router.get("/verify", account.verify);

router.get("/verify/resend", account.getVerificationPage);

// router.post("/verify/resend", account.resendVerification);

// router.get("/reset", account.getResetPage);

// router.post("/reset", account.reset);

// router.post("/update", account.update);

module.exports = router;
