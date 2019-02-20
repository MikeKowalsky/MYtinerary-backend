const express = require("express");
const mongoose = require("mongoose");
const { isEmpty } = require("../../validation/is-empty");

// Load itinerary model
const Itinerary = require("../../models/Itinerary");

// Load city model
const City = require("../../models/City");

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

module.exports = router;
