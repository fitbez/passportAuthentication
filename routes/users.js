const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/Auth");

// Login Page
router.get("/Login", (req, res) => res.render("Login"));

// Register Page
router.get("/Register", (req, res) => res.render("Register"));

// Register Page
router.get("/Dashboard", ensureAuthenticated, (req, res) =>
  res.render("Dashboard", {
    name: req.user.name
  })
);

// Register Handle
router.post("/Register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill in all fields" });
  }

  // User model
  const User = require("../models/User");

  // Check password match
  if (password !== password2) {
    errors.push({ msg: "passwords do not match" });
  }

  // Check pass length
  if (password.length < 6) {
    errors.push({ msg: "password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        // User exists
        errors.push({ msg: "Email is already registerd" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        // console.log(newUser);
        // res.send("come on");

        // // Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            //     // Set password to hashed
            newUser.password = hash;

            //     // Save user
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registerd and can log in"
                );
                res.redirect("/users/Login");
              })
              .catch((err = console.log(err)));
          })
        );
      }
    });
  }
});

// Login handle
router.post("/Login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/Dashboard",
    failureRedirect: "/users/Login",
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get("/Logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "you are logged out");
  res.redirect("/users/Login");
});

module.exports = router;
