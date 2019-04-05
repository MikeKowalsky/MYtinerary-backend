const express = require("express");
const passport = require("passport");

const itinerariesController = require("../../controllers/itineraries");

const router = express.Router();

// @route   GET api/itineraries
// @desc    Get all itineraries
// @access  Public
router.get("/", itinerariesController.getItineraries);

// @route   POST api/itineraries
// @desc    Add itinerary
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  itinerariesController.addItinerary
);

// @route   GET api/itineraries/single/:id
// @desc    Get itinerary by id
// @access  Public
router.get("/single/:id", itinerariesController.getItinerary);

// @route   GET api/itineraries/:cityName
// @desc    Get itineraries by cityName
// @access  Public
router.get("/:cityName", itinerariesController.getItinerariesByCityName);

// @route   GET api/itineraries/user/list
// @desc    Get itineraries by userId
// @access  Priavte
router.get(
  "/user/list",
  passport.authenticate("jwt", { session: false }),
  itinerariesController.getItinerariesByUser
);

module.exports = router;
