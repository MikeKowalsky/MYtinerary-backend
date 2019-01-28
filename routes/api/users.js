const express = require("express");
const router = express.Router();

// Load users model
const User = require("../../models/User");

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Testing users routes" }));

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.json({ error: "User already exist! Email needs to be unique." });
    } else {
      const avatar = req.body.avatar || null;

      const newUser = {
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      };
      res.json(newUser);
    }
  });
});

module.exports = router;
