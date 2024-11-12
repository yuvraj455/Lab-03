const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", user: req.user });
});

// GET /login
router.get("/login", (req, res, next) => {
  // Obtain session messages if any
  let messages = req.session.messages || [];
  // Clear messages
  req.session.messages = [];
  // Pass messages to view
  res.render("login", { title: "Login", messages: messages, user: req.user });
});

// POST /login
// Syntax will be a bit different since login will be handled by passport
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/streaks", // Redirect to streaks page
    failureRedirect: "/login",
    failureMessage: "Invalid credentials",
  })
);

// GET /register
router.get("/register", (req, res, next) => {
  res.render("register", { title: "Create a new account", user: req.user });
});

// POST /register
router.post("/register", (req, res, next) => {
  // Create a new user based on the information from the page
  // three parameters: new user object, password, callback function
  User.register(
    new User({
      username: req.body.username,
    }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);
        return res.redirect("/register");
      } else {
        req.login(newUser, (err) => {
          res.redirect("/streaks"); // Redirect to streaks page
        });
      }
    }
  );
});

// GET /logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    res.redirect("/login");
  });
});

// GOOGLE AUTH ROUTES

// GET /google - Triggers when user clicks on the "Login with Google" button on the login page
// User is sent to google.com to provide credentials
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// GET /auth/google/callback - This path is called after Google authentication
// Google middleware handles the callback and on success, redirects user to /projects
// Failure redirects user back to the /login page
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }), 
  (req, res, next) => {
    res.redirect("/streaks");
  }
);

module.exports = router;
