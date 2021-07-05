const express = require("express");
const router = express.Router();

const account = require("../controllers/accountController");

// const validate = require("../validations/mw.js");
// const userValidations = require("../validations/user.js");

// router.get("/", account.get);

router.get("/verify", account.verify);

router.get("/verify/resend", account.getVerificationPage);

router.post("/verify/resend", account.resendVerification);

router.get("/reset-password", account.getResetPasswordPage);

router.post("/reset-password", account.sendResetPasswordLink);

router.get("/reset-password/:token", account.getChangePasswordPage);

router.post("/reset-password/:token", account.changePassword);

router.post("/password", account.updatePassword);

router.get("/", account.get);

module.exports = router;
