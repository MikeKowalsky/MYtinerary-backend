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
router.get("/itineraries/:cityName", (req, res) => {
  console.log(req.params.cityName);
  // let cityId;

  City.findOne({ name: req.params.cityName }, (err, city) => {
    if (err) console.log(err);
    const cityId = city._id;
    console.log(cityId);

    Itinerary.find({ city: cityId }, (err, itineraryList) => {
      if (err) console.log(err);
      res.send(itineraryList);
    });
  });
});

// Set up the port and send a msg when start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}!`));
