const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

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
    if (user)
      res
        .status(400)
        .json({ error: "User already exist! Email needs to be unique." });

    const { name, email, password } = req.body;
    const avatar = req.body.avatar || null;

    const newUser = new User({
      name,
      email,
      avatar,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.status(201).json(user))
          .catch(err => console.log(err));
      });
    });
  });
});

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (!user) res.status(404).json({ error: "User not found" });
  });
});

module.exports = router;
