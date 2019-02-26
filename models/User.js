const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  favoriteItis: [
    {
      itineraryId: String,
      name: String,
      cityId: String
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
