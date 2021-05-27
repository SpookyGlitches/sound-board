require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const passport = require("./config/passport");
const flash = require("connect-flash");

const authRouter = require("./routes/auth");
const homeRouter = require("./routes/home");
const svboardsRouter = require("./routes/savedBoards");
const sboardsRouter = require("./routes/soundBoards");
const profileRouter = require("./routes/profile");

const isAuthenticated = require("./middlewares/isAuthenticated");
const handleError = require("./middlewares/handleError");

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

app.get("/", (req, res) => res.redirect("/home"));

app.use("/static", express.static("public"));
app.use("/auth", authRouter);

app.use(isAuthenticated);

app.use("/home", homeRouter);
app.use("/savedboards", svboardsRouter);
app.use("/soundboards", sboardsRouter);
app.use("/profile", profileRouter);

app.use(handleError);

app.listen(port, () => {
	console.log(`App listening in ${port}`);
});
