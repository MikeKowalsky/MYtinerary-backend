const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const isEmpty = require("../../validation/is-empty");

// meassage model
const Message = require("../../models/Message");

const router = express.Router();

// @route   GET api/messages
// @desc    Get all messages
// @access  Public
router.get("/", (req, res) => {
  Message.find()
    .sort({ timeStamp: -1 })
    .then(messages => res.json(messages))
    .catch(err => res.status(404).json({ error: "No messages found!" }));
});

// @route   GET api/messages/:id
// @desc    Get messages by id
// @access  Public
router.get("/:id", (req, res) => {
  Message.findById(req.params.id)
    .then(message => res.json(message))
    .catch(err =>
      res.status(404).json({ error: "No message with this id found!" })
    );
});

// @route   GET api/messages/itinerary/:id
// @desc    Get messages by id
// @access  Public
router.get("/itinerary/:id", (req, res) => {
  Message.find({ itineraryId: req.params.id })
    .then(messages => res.json(messages))
    .catch(err =>
      res.status(404).json({ error: "No messages for this itinerary!" })
    );
});

// @route   POST api/messages
// @desc    Create message
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { text, name, avatar, itineraryId } = req.body;

    // validation
    if (isEmpty(text) || isEmpty(name))
      return res.status(400).json({ error: "Text and name can't be empty!" });

    const newMessage = new Message({
      user: req.user.id,
      text,
      name,
      itineraryId,
      avatar
    });

    newMessage
      .save()
      .then(message => res.json(message))
      .catch(err => res.status(403).json({ error: "Save error" }));
  }
);

module.exports = router;
