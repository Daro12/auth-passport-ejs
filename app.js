const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

// passort config
const passport = require("passport");
require("./config/passport")(passport);

const flash = require("connect-flash");
const session = require("express-session");

const app = express();

// CONNETING TO DATABASE
const db = require("./config/key").MongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoBD connected"))
  .catch((err) => {
    console.log(err);
  });

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");


// Bodyparser
app.use(express.urlencoded({ extended: false }));

// EXPRESS SESSION
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
// PASSPORT MIDDLEWARE (HAS TO PUT IT AFTER EXPRESS SESSION)
app.use(passport.initialize());
app.use(passport.session());


// CONNECT TO FLASH
app.use(flash());

// GLOBAL VARS
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});

// Route

app.use("/", require("./routes/index"));

app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 3002;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
