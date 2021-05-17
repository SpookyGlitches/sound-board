const express = require("express");
const router = express.Router();

const sound = require("../controllers/soundController");
const validate = require("../validations/mw");
const soundValidation = require("../validations/sound");

router.post("/create", sound.create);

router.get("/:soundId/edit", sound.update);

router.post("/:soundId/delete", sound.destroy);

module.exports = router;
