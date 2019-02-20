const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  itineraryId: Schema.Types.ObjectId,
  text: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: String,
  timeStamp: {
    type: Date,
    default: Date.now
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ]
});

module.exports = mongoose.model("Message", messageSchema);
