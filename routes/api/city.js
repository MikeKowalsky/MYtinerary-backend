const express = require("express");
const router = express.Router();

// Load City model
const City = require("../../models/City");

// @route   GET api/city/all
// @desc    Get all cities
// @access  Public
router.get("/all", (req, res) => {
  City.find()
    .then(docs => res.send(docs))
    .catch(err => console.log(err));
});

// @route   GET api/city/all/full
// @desc    Get all cities with itinerary array
// @access  Public
router.get("/all/full", (req, res) => {
  City.find()
    .populate("itineraries", ["id", "name"])
    .then(docs => res.send(docs))
    .catch(err => console.log(err));
});

module.exports = router;
