const express = require("express");
const bodyParser = require("body-parser");

// initialize app
const app = express();

// body parser middelware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mongoose connect
const mongoose = require("mongoose");
const dev_db_url = "mongodb://mike:mike666@ds211504.mlab.com:11504/mern_one";
const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose
  .connect(
    mongoDB,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const db = mongoose.connection;
// mongoose.Promise = global.Promise;  // ?? don't know if I need this

// just retrieving whole collection
// app.get("/cities", (req, res) => {
//   db.collection("cities")
//     .find()
//     .toArray((err, results) => {
//       res.send(results);
//     });
// });

// acts as a middleware
// to handle CORS Errors
app.use((req, res, next) => {
  //doesn't send response - just adjust it
  res.header("Access-Control-Allow-Origin", "*"); //* to give access to any origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requestes-With, Content-Type, Accept, Authorization" //to give access to all the headers provided
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"); //to give access to all the methoda provided
    return res.status(200).json({});
  }
  next(); //so that other routes can take over
});

// Routes
// Home && test page route
const router = express.Router();

// Use routes
app.use("/", router);

router.get("/", (req, res) => res.send("Hello guy's! This is home page!"));
router.get("/test", (req, res) => res.send("HELLO WORLD!"));

// retrieving using schema
const CityModel = require("./models/City");
router.get("/cities/all", (req, res) => {
  CityModel.find()
    .then(docs => res.send(docs))
    .catch(err => console.log(err));
});

const ItineraryModel = require("./models/Itinerary");
router.get("/itineraries", (req, res) => {
  ItineraryModel.find()
    .then(docs => res.send(docs))
    .catch(err => console.log(err));
});

router.post("/addData", (req, res) => {
  console.log(req.body);

  // const newCity = new CityModel({
  //   _id: new mongoose.Types.ObjectId,
  //   name: "Barcelona",
  //   country: "Spain"
  // })

  CityModel.findOne({ name: "Barcelona" }, (err, city) => {
    if (err) console.log(err);

    console.log(city._id);

    const newItinerary = new ItineraryModel({
      _id: new mongoose.Types.ObjectId(),
      author: req.body.author,
      city: city.id,
      name: req.body.name,
      rating: req.body.rating,
      likes: req.body.likes,
      duration: req.body.duration,
      priceRange: req.body.priceRange,
      tags: req.body.tags,
      activities: req.body.activities
    });

    newItinerary.save(err => {
      if (err) console.log(err);
    });

    // newItinerary.populate("city").exec(function(err, itinerary) {
    //   if (err) console.log(err);

    //   console.log("The city is %s", itinerary.city.name);
    // });

    // Story.
    // findOne({ title: 'Casino Royale' }).
    // populate('author').
    // exec(function (err, story) {
    //   if (err) return handleError(err);
    //   console.log('The author is %s', story.author.name);
    //   // prints "The author is Ian Fleming"
    // });

    res.send("created new Itinerary");
  });

  // res.send("post ok");
  // "author": "GaudiLover",
  //   "name": "Gaudi In A Day",
  //   "rating": 4.67,
  //   "likes": 34,
  //   "duration": 12,
  //   "priceRange": 2,
  //   "tags": [
  //       "Art",
  //       "Architecture",
  //       "History"
  //   ],
  //   "activities": [
  //       "Casa Balto",
  //       "Le Pedrera",
  //       "Sagrada Familia"
  //   ]
});

// Set up the port and send a msg when start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}!`));
