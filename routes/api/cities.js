const express = require("express");
const router = express.Router();

const citiesController = require("../../controllers/cities");

// @route   GET api/cities
// @desc    Get all cities
// @access  Public
router.get("/", citiesController.getCities);

module.exports = router;
