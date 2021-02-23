require("dotenv").config();
var express = require("express");
var router = express.Router();
const connection = require("../database");
const { v4: uuidv4 } = require("uuid");

router.post("/", function (req, res) {
	if (!(req.files && req.body.label && req.body.category_id)) {
        res.send("Missing fields");
	} else {
        const file = req.files.audio;
		const fileName = uuidv4() + file.name;
		file.mv(process.env.UPL_PATH + fileName)
			.then(() => {
				req.body.file = fileName;
				connection.query(
					"INSERT INTO audios SET ? ",
					req.body,
					(err, results) => {
						if (err) res.send(err);
						else res.redirect("/");
					}
				);
			})
			.catch((err) => res.send(err));
	}
});

router.post("/create-category", function (req, res) {
	connection.query(
		"INSERT INTO categories (title) VALUES (?)",
		req.body.title,
		function (err, results) {
			if (err) res.send(err);
			else res.redirect("/");
		}
	);
});

router.post("/delete-category", function(req,res) {
    connection.query("DELETE FROM categories WHERE category_id = ?", req.body.category_id, function(err,results){
        if(err) res.send(err);
        else res.redirect("/")
    })
})
module.exports = router;
