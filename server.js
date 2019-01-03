const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("./middleware/cors");

// initialize app
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//handle CORS Errors
app.use(cors);

// mongoose connect
const mongoDB = `mongodb://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@ds211504.mlab.com:11504/${process.env.MONGO_DB}`;

mongoose
  .connect(
    mongoDB,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
// Home && test page route
const router = express.Router();

// Use routes
app.use("/", router);

router.get("/", (req, res) => res.send("Hello guy's! This is home page!"));
router.get("/test", (req, res) => res.send("HELLO WORLD!"));

// retrieving all cities using schema
const City = require("./models/City");
router.get("/cities/all", (req, res) => {
  City.find()
    .then(docs => res.send(docs))
    .catch(err => console.log(err));
});

// retrieving all itineraries using schema
const Itinerary = require("./models/Itinerary");
router.get("/itineraries/all", (req, res) => {
  Itinerary.find()
    .then(docs => res.send(docs))
    .catch(err => console.log(err));
});

// adding data to itineraries collection
router.post("/addData", (req, res) => {
  console.log(req.body);

  City.findOne({ name: req.body.cityName }, (err, city) => {
    if (err) console.log(err);

    console.log(city._id);

    const newItinerary = new Itinerary({
      _id: new mongoose.Types.ObjectId(),
      author: req.body.author,
      city: city._id,
      name: req.body.name,
      rating: req.body.rating,
      duration: req.body.duration,
      priceRange: req.body.priceRange,
      tags: req.body.tags
    });

    newItinerary.save(err => {
      if (err) console.log(err);
    });

    res.send("created new Itinerary");
  });
});

// retrieving itineraries for one particular city
router.get("/itinerary/:cityName", (req, res) => {
  console.log(req.params.cityName);
  // let cityId;

  City.findOne({ name: req.params.cityName }, (err, city) => {
    if (err) console.log(err);
    const cityId = city._id;
    // console.log(cityId);

    Itinerary.find({ city: cityId }, (err, itineraryList) => {
      if (err) console.log(err);
      res.send(itineraryList);
    });
  });
});

// Set up the port and send a msg when start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}!`));
