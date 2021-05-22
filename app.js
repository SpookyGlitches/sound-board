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
app.use(
	fileUpload({
		safeFileNames: true,
	})
);

app.use(function (req, res, next) {
	res.locals.success = req.flash("success");
	res.locals.errors = req.flash("errors");
	next();
});

app.use("/static", express.static("public"));

app.use("/auth", require("./routes/auth"));
app.use("/home", require("./routes/home"));
app.use("/savedboards", require("./routes/savedBoards"));
app.use("/soundboards", require("./routes/soundBoards"));
app.use("/test", require("./routes/test"));

app.listen(port, () => {
	console.log(`App listening in ${port}`);
});
