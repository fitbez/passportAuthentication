const express = require("express");
const router = express.Router();

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
    errors.push({ msg: "plese fill in all fields" });
  }

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
    res.send("pass");
  }
});

module.exports = router;
