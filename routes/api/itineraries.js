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
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    City.findOne({ _id: req.body.cityId }, (err, city) => {
      if (err) throw err;
      const { name, duration, priceRange, images } = req.body;

      // validation
      if (isEmpty(name) || isEmpty(duration) || isEmpty(priceRange))
        return res
          .status(400)
          .json({ error: "Name, duration, price range can't be empty!" });

      const rating = 4; // default in the beginnng
      const likes = 0;
      // tag will come as strings with words separated with # signs
      // eg #architecture #Gaudi #barcelona #sun
      const tagArray = [];
      req.body.tags.split("#").forEach(e => {
        if (e !== "") {
          tagArray.push(e.trim());
        }
      });

      const userObj = {
        id: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar
      };

      const newItinerary = new Itinerary({
        _id: new mongoose.Types.ObjectId(),
        user: userObj,
        city: city._id,
        name,
        rating,
        likes,
        duration,
        priceRange,
        tags: tagArray,
        images: JSON.parse(images)
      });

      newItinerary.save(err => {
        if (err) console.log(err);
      });

      res.status(201).json(newItinerary);
    });
  }
);

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
            itinerary => itinerary._id.toString() === req.body.id.toString()
          ).length > 0
        )
          return res
            .status(400)
            .json({ error: "User already like this itinerary!" });

        user.favoriteItis.push(req.body.id.toString());
        user
          .save()
          .then(user => res.json(user.favoriteItis))
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
          !Array.from(user.favoriteItis.map(e => e._id.toString())).includes(
            req.body.id.toString()
          )
        ) {
          return res
            .status(400)
            .json({ error: "User does not like this itinerary!" });
        }

        const indexToRemove = user.favoriteItis
          .map(item => item._id.toString())
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

module.exports = router;
