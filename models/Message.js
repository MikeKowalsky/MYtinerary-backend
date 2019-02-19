const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const messageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
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

//Export schema as a module
module.exports = mongoose.model("Message", messageSchema);
