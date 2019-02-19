const express = require("express");
const router = express.Router();

// Load city model
const City = require("../../models/City");

// @route   GET api/cities
// @desc    Get all cities
// @access  Public
router.get("/", (req, res) => {
  City.find()
    .then(docs => res.send(docs))
    .catch(err => console.log(err));
});

module.exports = router;
