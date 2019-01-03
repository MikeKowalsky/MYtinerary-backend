const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const itinerarySchema = new Schema({
  city: {
    type: Schema.Types.ObjectId,
    ref: "City"
  },
  author: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  priceRange: {
    type: String,
    required: true
  },
  tags: {
    type: [String]
  }
});

//Export schema as a module
module.exports = mongoose.model("Itinerary", itinerarySchema);
