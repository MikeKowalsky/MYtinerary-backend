const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const isEmpty = require("../../validation/is-empty");
const keys = require("../../config/keys");

// Load users model
const User = require("../../models/User");

// Load itinerary model
const Itinerary = require("../../models/Itinerary");

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

    const { name, email, password, avatar } = req.body;

    // simple validation
    if (isEmpty(name) || isEmpty(email) || isEmpty(password))
      return res
        .status(400)
        .json({ error: "Name, email, password can't be empty!" });

    const newUser = new User({
      name,
      email,
      avatar,
      password,
      favoriteItis: []
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
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };

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
      .then(response => {
        // remove password before sending back
        const userDetails = Object.assign({}, response._doc);
        delete userDetails.password;

        res.json(userDetails);
      })
      .catch(err => res.status(404).json({ error: "User does not exist!" }));
  }
);

// @route   POST api/users/favorites
// @desc    User favorites itineraries
// @access  Private
router.get(
  "/favorites",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id })
      .then(response => {
        // take only favorites
        const userFavorites = [...response._doc.favoriteItis];
        res.json(userFavorites);
      })
      .catch(err => res.status(404).json({ error: "User does not exist!" }));
  }
);

// @route   POST api/users/addToFav
// @desc    Add itinerary to favorites
// @access  Private
router.post(
  "/addToFav",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id })
      .then(user => {
        if (
          user.favoriteItis.filter(
            itinerary =>
              itinerary.itineraryId.toString() === req.body.id.toString()
          ).length > 0
        )
          return res
            .status(400)
            .json({ error: "User already like this itinerary!" });

        Itinerary.findOne({ _id: req.body.id })
          .then(itinerary => {
            user.favoriteItis.push({
              itineraryId: req.body.id,
              name: itinerary.name,
              cityId: itinerary.city
            });
            user
              .save()
              .then(user => res.json(user.favoriteItis))
              .catch(err => res.status(500).json({ error: "Save error" }));
          })
          .catch(err =>
            res
              .status(404)
              .json({ error: "Can't find itinerary with this id!" })
          );
      })
      .catch(err => res.status(404).json({ error: "User not found!" }));
  }
);

// @route   POST api/users/removeFromFav
// @desc    Remove itinerary from favorites
// @access  Private
router.post(
  "/removeFromFav",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id })
      .then(user => {
        if (
          !Array.from(
            user.favoriteItis.map(e => e.itineraryId.toString())
          ).includes(req.body.id.toString())
        ) {
          return res
            .status(400)
            .json({ error: "User does not like this itinerary!" });
        }

        const indexToRemove = user.favoriteItis
          .map(item => item.itineraryId.toString())
          .indexOf(req.body.id.toString());

        user.favoriteItis.splice(indexToRemove, 1);
        user
          .save()
          .then(user => res.json(user.favoriteItis))
          .catch(err => res.status(500).json({ error: "Save error" }));
      })
      .catch(err =>
        res.status(404).json({ error: "User not found!", err: err })
      );
  }
);

// @route   POST api/users/oauth
// @desc
// @access  Private
router.post("/oauth", passport.authenticate("googleToken", { session: false }));

module.exports = router;
