const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const isEmpty = require("../../validation/is-empty");
const keys = require("../../config/keys");

// Load users model
const User = require("../../models/User");

const router = express.Router();

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user)
      return res
        .status(400)
        .json({ error: "User already exist! Email needs to be unique." });

    const { name, email, password } = req.body;
    const avatar = req.body.avatar || null;

    // simple validation
    if (isEmpty(name) || isEmpty(email) || isEmpty(password))
      return res
        .status(400)
        .json({ error: "Name, email, password can't be empty!" });

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

  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(404).json({ error: "User not found" });

      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch)
          return res
            .status(403)
            .json({ error: "Invalid username or password" });

        // JWT Token payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        // JWT sign
        jwt.sign(
          payload,
          keys.JWT_SECRET,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      });
    })
    .catch(err => console.log(err));
});

// @route   POST api/users
// @desc    User details
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id })
      .then(user => res.json(user))
      .catch(err => res.status(404).json({ error: "User does not exist!" }));
  }
);

module.exports = router;
