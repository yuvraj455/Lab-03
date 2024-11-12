var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// Router Objects
var indexRouter = require("./routes/index");
var streaksRouter = require("./routes/streaks");
var skillsRouter = require("./routes/skills");
// var usersRouter = require('./routes/users');
// Import MongoDB and Configuration modules
var mongoose = require("mongoose");
var configs = require("./configs/globals");
// HBS Helper Methods
var hbs = require("hbs");
// Import passport and session modules
var passport = require("passport");
var session = require("express-session");
// Import user model
var User = require("./models/user");
// Import Google Strategy
var GoogleStrategy = require("passport-google-oauth20").Strategy;
// Express App Object
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Express Configuration
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configure passport module
app.use(
  session({
    secret: "s2021pr0j3ctTracker",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Link passport to the user model
passport.use(User.createStrategy());

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: configs.Authentication.Google.ClientId,
      clientSecret: configs.Authentication.Google.ClientSecret,
      callbackURL: configs.Authentication.Google.CallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if the user already exists
      let user = await User.findOne({ oauthId: profile.id });
      if (user) {
        return done(null, user);
      } else {
        // If user is new, create and save to DB
        user = new User({
          username: profile.displayName,
          oauthId: profile.id,
          oauthProvider: "Google",
          created: Date.now(),
        });
        const savedUser = await user.save();
        return done(null, savedUser);
      }
    }
  )
);

// Set passport to write/read user data to/from session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routing Configuration
app.use("/", indexRouter);
app.use("/streaks", streaksRouter);
app.use("/skills", skillsRouter);

// Connecting to the DB
mongoose
  .connect(configs.ConnectionStrings.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected Successfully!"))
  .catch((error) => console.log(`Error while connecting: ${error}`));

// Handlebars Helpers
hbs.registerHelper("createOptionElement", (currentValue, selectedValue) => {
  let selectedProperty = currentValue == selectedValue.toString() ? "selected" : "";
  return new hbs.SafeString(`<option ${selectedProperty}>${currentValue}</option>`);
});

hbs.registerHelper("toShortDate", (longDateValue) => {
  return new hbs.SafeString(longDateValue.toLocaleDateString("en-CA"));
});

// Google Authentication Routes
// Trigger Google Login
app.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/streaks"); // Redirect to streaks on successful login
  }
);

// Logout Route
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    res.redirect("/login");
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
