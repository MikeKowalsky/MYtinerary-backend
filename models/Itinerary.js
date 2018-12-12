const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const itinerarySchema = new Schema({
  city: { type: Schema.Types.ObjectId, ref: "City" },
  author: String,
  name: String,
  rating: Number,
  duration: Number,
  priceRange: Number,
  tags: [String]
});

//Export schema as a module
module.exports = mongoose.model("Itinerary", itinerarySchema);
