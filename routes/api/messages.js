const express = require("express");
const router = express.Router();
const passport = require("passport");

// meassage model
const Message = require("../../models/Message");

// @route   GET api/messages/test
// @desc    Just testing
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Testing messages route" }));

// @route   GET api/messages
// @desc    Get all messages
// @access  Public
router.get("/", (req, res) => {
  Message.find()
    .sort({ timeStamp: -1 })
    .then(messages => res.json(messages))
    .catch((err = res.status(404).json({ error: "No messages found!" })));
});

// @route   GET api/messages/:id
// @desc    Get messages by id
// @access  Public
router.get("/:id", (req, res) => {
  Message.findById(req.params.id)
    .then(message => res.json(message))
    .catch(err =>
      res.status(404).json({ error: "No message with this is found!" })
    );
});

// @route   POST api/messages
// @desc    Create message
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // validation needed

    const newMessage = new Message({
      user: req.user.id,
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar
    });

    // watch it
    newMessage
      .save()
      .then(message => res.json(message))
      .catch(err => res.status(400).json({ error: "Save error" }));
  }
);

module.exports = router;
