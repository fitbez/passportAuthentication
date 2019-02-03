const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Login Page
router.get("/Login", (req, res) => res.render("Login"));

// Register Page
router.get("/Register", (req, res) => res.render("Register"));

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
          passord2
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
                res.redirect("/users/Login");
              })
              .catch((err = console.log(err)));
          })
        );
      }
    });
  }
});

module.exports = router;
