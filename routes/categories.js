const express = require("express");
const csrf = require("csurf");
const router = express.Router({
	mergeParams: true,
});
const csrfProtection = csrf();

const category = require("../controllers/categoryController");
const validate = require("../validations/mw");
const categoryValidation = require("../validations/category");
const soundRouter = require("./sounds");

router.post(
	"/create",
	csrfProtection,
	validate(categoryValidation),
	category.create
);

router.get("/:categoryId", csrfProtection, category.index);

router.post(
	"/:categoryId/update",
	csrfProtection,
	validate(categoryValidation),
	category.update
);

router.post("/:categoryId/delete", csrfProtection, category.destroy);

router.use("/:categoryId/sounds", soundRouter);

module.exports = router;
