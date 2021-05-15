require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
// const connection = require("./database");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

app.use("/static", express.static("public"));

app.get("/explore", (req, res) => {
	res.render("explore");
});
app.get("/", (req, res) => {
	res.render("home");
});
app.get("/create", (req, res) => {
	res.render("create");
});

app.get("/category", (req, res) => {
	res.render("category");
});
app.get("/profile", (req, res) => {
	res.render("profile");
});
app.get("/signin", (req, res) => {
	res.render("signIn");
});
app.get("/signup", (req, res) => {
	res.render("signUp");
});
// const getAudio = async (req, res) => {
// 	try {
// 		let [categories] = await connection
// 			.promise()
// 			.query("SELECT * FROM categories");
// 		let [audios] = await connection
// 			.promise()
// 			.query(
// 				"SELECT * FROM audios a INNER JOIN categories c ON a.category_id = c.category_id"
// 			);
// 		let array = [];

// 		categories.forEach((category) => {
// 			array.push({
// 				category: category,
// 				audios: audios.filter(
// 					(audio) => audio.title == category.title
// 				),
// 			});
// 		});
// 		res.render("index", {
// 			array,
// 			categories,
// 		});
// 	} catch (err) {
// 		console.log(err);
// 		res.send(err);
// 	}
// };

// app.use("/audio", require("./routes/audio"));

app.listen(port, () => {
	console.log(`App listening in ${port}`);
});
