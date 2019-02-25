const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const itinerarySchema = new Schema({
  city: {
    type: Schema.Types.ObjectId,
    ref: "City"
  },
  // TODO: should be taken from the user account
  user: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    avatar: String
  },
  name: {
    type: String,
    required: true
  },
  rating: Number,
  likes: Number,
  duration: {
    type: Number,
    required: true
  },
  priceRange: {
    type: String,
    required: true
  },
  tags: [String],
  images: [
    {
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ]
});

//Export schema as a module
module.exports = mongoose.model("Itinerary", itinerarySchema);
