const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Load keys
const keys = require("../../config/keys");

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
      if (err) throw err;
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

// @route   POST api/users/login
// @desc    Login user / Geting JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (!user) res.status(404).json({ error: "User not found" });

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch)
        res.status(403).json({ error: "Invalid username or password" });

      // JWT Token payload
      const payload = { id: user.id, name: user.name, avatar: user.avatar };

      // JWT sign
      jwt.sign(payload, keys.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.status(200).json({
          success: true,
          token: "Bearer " + token
        });
      });
    });
  });
});

module.exports = router;
