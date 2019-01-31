const express = require("express");
const router = express.Router();

// Login Page
router.get("/Login", (req, res) => res.send("Login"));

// Register Page
router.get("/Register", (req, res) => res.send("Register"));

module.exports = router;
