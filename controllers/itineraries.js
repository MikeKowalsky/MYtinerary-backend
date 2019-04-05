const mongoose = require("mongoose");

const isEmpty = require("../validation/is-empty");

const Itinerary = require("../models/Itinerary");
const City = require("../models/City");

exports.getItineraries = async (req, res) => {
  try {
    const docs = await Itinerary.find().populate("city", ["id", "name"]);
    res.send(docs);
  } catch (err) {
    console.log(err);
  }
};

exports.addItinerary = async (req, res) => {
  const { name, duration, priceRange, images, cityId, tags } = req.body;

  if (isEmpty(name) || isEmpty(duration) || isEmpty(priceRange))
    return res
      .status(400)
      .json({ error: "Name, duration, price range can't be empty!" });

  const rating = 4; // default in the beginnng
  const likes = 0;

  // tag will come as strings with words separated with # signs
  // eg #architecture#Gaudi#barcelona#sun
  const tagArray = [];
  tags.split("#").forEach(e => {
    if (e !== "") {
      tagArray.push(e.trim());
    }
  });

  const userObj = {
    id: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar
  };

  try {
    const city = await City.findOne({ _id: cityId });
    if (!city) res.status(404).json({ message: "City does not exist." });

    const newItinerary = new Itinerary({
      _id: new mongoose.Types.ObjectId(),
      user: userObj,
      city: city._id,
      name,
      rating,
      likes,
      duration,
      priceRange,
      tags: tagArray,
      images: JSON.parse(images)
    });

    await newItinerary.save();
    res.status(201).json(newItinerary);
  } catch (err) {
    console.log(err);
  }
};

exports.getItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ _id: req.params.id });
    res.send(itinerary);
  } catch (err) {
    console.log(err);
  }
};

exports.getItinerariesByCityName = async (req, res) => {
  try {
    const city = await City.findOne({ name: req.params.cityName });
    const itineraryList = await Itinerary.find({ city: city._id });
    res.send(itineraryList);
  } catch (err) {
    console.log(err);
  }
};

exports.getItinerariesByUser = async (req, res) => {
  try {
    const itineraryList = await Itinerary.find({ "user.id": req.user.id });
    res.send(itineraryList);
  } catch (err) {
    console.log(err);
  }
};
