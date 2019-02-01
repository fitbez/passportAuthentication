const express = require("express");
const router = express.Router();

// Login Page
router.get("/Login", (req, res) => res.render("Login"));

// Register Page
router.get("/Register", (req, res) => res.render("Register"));

module.exports = router;
