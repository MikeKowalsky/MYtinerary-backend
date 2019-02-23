const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const isEmpty = require("../../validation/is-empty");

// Load itinerary model
const Itinerary = require("../../models/Itinerary");

// Load city model
const City = require("../../models/City");

// Load user model
const User = require("../../models/User");

const router = express.Router();

// @route   GET api/itineraries
// @desc    Get all itineraries
// @access  Public
router.get("/", (req, res) => {
  Itinerary.find()
    .populate("city", ["id", "name"])
    .then(docs => res.send(docs))
    .catch(err => console.log(err));
});

// @route   POST api/itineraries
// @desc    Add itinerary
// @access  Public
router.post("/", (req, res) => {
  City.findOne({ name: req.body.cityName }, (err, city) => {
    if (err) throw err;
    const { author, name, rating, likes, duration, priceRange } = req.body;

    // validation
    if (
      isEmpty(author) ||
      isEmpty(name) ||
      isEmpty(duration) ||
      isEmpty(priceRange)
    )
      return res
        .status(400)
        .json({ error: "Author, name, duration, price range can't be empty!" });

    const newItinerary = new Itinerary({
      _id: new mongoose.Types.ObjectId(),
      author,
      city: city._id,
      name,
      rating,
      likes,
      duration,
      priceRange
      //tags: req.body.tags, // this will be a problem in app - or csv or additional POST
      //images: req.body.images // this will be a problem in app - rather only additional POST req
    });

    newItinerary.save(err => {
      if (err) console.log(err);
    });

    res.status(201).json(newItinerary);
  });
});

// @route   GET api/itineraries/single/:id
// @desc    Get itinerary by id
// @access  Public
router.get("/single/:id", (req, res) => {
  Itinerary.find({ _id: req.params.id }, (err, itineraryList) => {
    if (err) throw err;
    res.send(itineraryList[0]);
  });
});

// @route   GET api/itineraries/:cityName
// @desc    Get itineraries by city
// @access  Public
router.get("/:cityName", (req, res) => {
  City.findOne({ name: req.params.cityName }, (err, city) => {
    if (err) throw err;
    const cityId = city._id;

    Itinerary.find({ city: cityId }, (err, itineraryList) => {
      if (err) throw err;
      res.send(itineraryList);
    });
  });
});

// @route   POST api/itineraries/addToFav
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
            itinerary => itinerary._id.toString() === req.body.itineraryId
          ).length > 0
        )
          return res
            .status(400)
            .json({ error: "User already like this itinerary!" });

        user.favoriteItis.push(req.body.itineraryId);
        user
          .save()
          .then(user => res.json(user))
          .catch(err => res.status(500).json({ error: "Save error" }));
      })
      .catch(err => res.status(404).json({ error: "User not found!" }));
  }
);

// @route   POST api/itineraries/removeFromFav
// @desc    Remove itinerary from favorites
// @access  Private
router.post(
  "/removeFromFav",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id })
      .then(user => {
        if (
          user.favoriteItis.filter(
            itinerary => itinerary._id.toString() === req.body.itineraryId
          ).length === 0
        )
          return res
            .status(400)
            .json({ error: "User does not like this itinerary!" });

        const indexToRemove = user.favoriteItis
          .map(item => item._id.toString())
          .indexOf(req.body.itineraryId);

        user.favoriteItis.splice(indexToRemove, 1);
        user
          .save()
          .then(user => res.json(user))
          .catch(err => res.status(500).json({ error: "Save error" }));
      })
      .catch(err => res.status(404).json({ error: "User not found!" }));
  }
);

module.exports = router;
