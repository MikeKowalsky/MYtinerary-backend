const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Load Itinerary model
const Itinerary = require("../../models/Itinerary");
// Load City model
const City = require("../../models/City");

// @route   GET api/itinerary/all
// @desc    Get all itineraries
// @access  Public
router.get("/all", (req, res) => {
  Itinerary.find()
    .then(docs => res.send(docs))
    .catch(err => console.log(err));
});

// @route   POST api/itinerary/add
// @desc    Add itinerary
// @access  Public
router.post("/add", (req, res) => {
  // console.log(req.body);

  City.findOne({ name: req.body.cityName }, (err, city) => {
    if (err) console.log(err);
    const newItinerary = new Itinerary({
      _id: new mongoose.Types.ObjectId(),
      author: req.body.author,
      city: city._id,
      name: req.body.name,
      rating: req.body.rating,
      duration: req.body.duration,
      priceRange: req.body.priceRange,
      tags: req.body.tags
    });

    newItinerary.save(err => {
      if (err) console.log(err);
    });

    res.status(201).json(newItinerary);
  });
});

// @route   GET api/itinerary/:cityName
// @desc    Get itineraries by city
// @access  Public
router.get("/:cityName", (req, res) => {
  console.log(req.params.cityName);

  City.findOne({ name: req.params.cityName }, (err, city) => {
    if (err) console.log(err);
    const cityId = city._id;

    Itinerary.find({ city: cityId }, (err, itineraryList) => {
      if (err) console.log(err);
      res.send(itineraryList);
    });
  });
});

module.exports = router;
