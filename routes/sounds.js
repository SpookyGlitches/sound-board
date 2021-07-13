const express = require("express");
const csrf = require("csurf");
const router = express.Router({
	mergeParams: true,
});
const csrfProtection = csrf();

const sound = require("../controllers/soundController");

const validate = require("../validations/mw");
const soundValidation = require("../validations/sound");

router.get("/:soundId/play", sound.play);

router.use(csrfProtection);

router.post("/create", validate(soundValidation), sound.create);

router.get("/:soundId/edit", sound.getOne);

router.post("/:soundId/edit", validate(soundValidation), sound.update);

router.post("/:soundId/delete", sound.destroy);

module.exports = router;
