const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const City = require("./City");

//Create Schema
const schema = new Schema({
  city: { type: Schema.Types.ObjectId, ref: "City" },
  author: String,
  name: String,
  rating: Number,
  likes: Number,
  duration: Number,
  priceRange: Number,
  tags: [String],
  activities: [String]
});

//Export schema as a module
module.exports = mongoose.model("Itinerary", schema);
