require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const passport = require("./config/passport");
const flash = require("connect-flash");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "C4$s", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());

app.use("/static", express.static("public"));

app.use(function (req, res, next) {
	res.locals.message = req.flash("errors");
	next();
});

app.use("/auth", require("./routes/auth"));
app.use("/home", require("./routes/home"));
app.use((req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/auth/signin");
	}
});
app.use("/savedboards", require("./routes/savedBoards"));
app.use("/soundboards", require("./routes/soundBoards"));

// app.get("/savedboards", (req, res) => {
// 	res.json("hello");
// });

app.listen(port, () => {
	console.log(`App listening in ${port}`);
});
