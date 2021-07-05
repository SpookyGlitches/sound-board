const express = require("express");
const router = express.Router();

const account = require("../controllers/accountController");

const validate = require("../validations/mw");
const userValidation = require("../validations/user");

router.get("/verify", account.verify);

router.get("/verify/resend", account.getVerificationPage);

router.post(
	"/verify/resend",
	validate([userValidation.signin[0]]),
	account.resendVerification
);

router.get("/reset-password", account.getResetPasswordPage);

router.post(
	"/reset-password",
	validate([userValidation.signin[0]]),
	account.sendResetPasswordLink
);

router.get("/reset-password/:token", account.getChangePasswordPage);

router.post(
	"/reset-password/:token",
	validate(userValidation.changePassword),
	account.changePassword
);

router.post(
	"/password",
	validate([userValidation.signup[2], userValidation.signup[3]]),
	account.updatePassword
);

router.get("/", account.get);

router.post(
	"/",
	validate([userValidation.signup[0]]),
	account.updateDisplayName
);

module.exports = router;
