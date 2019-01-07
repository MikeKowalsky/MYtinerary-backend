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

module.exports = router;
