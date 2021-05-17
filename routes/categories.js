const express = require("express");
const router = express.Router();

const category = require("../controllers/categoryController");
const validate = require("../validations/mw");
const categoryValidation = require("../validations/soundBoard");

router.post("/create", category.create);

router.get("/:categoryId", category.getOne);

router.get("/:categoryId/update", category.update);

router.post("/:categoryId/destroy", category.destroy);

module.exports = router;
