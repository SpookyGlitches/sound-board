const express = require("express");
const router = express.Router({
	mergeParams: true,
});

const category = require("../controllers/categoryController");

const validate = require("../validations/mw");
const categoryValidation = require("../validations/category");

const soundRouter = require("./sounds");

router.post("/create", validate(categoryValidation), category.create);

router.get("/:categoryId", category.index);

router.post(
	"/:categoryId/update",
	validate(categoryValidation),
	category.update
);

router.post("/:categoryId/delete", category.destroy);

router.use("/:categoryId/sounds", soundRouter);

module.exports = router;
