const express = require("express");

// initialize app
const app = express();

// // Connect to MongoDB by Monooose // Schema dosn't work ??
// const mongoose = require("mongoose");
// const dev_db_url = "mongodb://mike:mike666@ds211504.mlab.com:11504/mern_one";
// const mongoDB = process.env.MONGODB_URI || dev_db_url;
// mongoose.connect(mongoDB);
// // .then(() => console.log("MongoDB Connected")) // not sure that I need those two lines
// // .catch(err => console.log(err)); // not sure that I need those two lines
// mongoose.Promise = global.Promise;

// const db = mongoose.connection;
// db.once("error", console.error.bind(console, "MongoDB connection error"));

// old version of mongoose connect
const mongoose = require("mongoose");
const dev_db_url = "mongodb://mike:mike666@ds211504.mlab.com:11504/mern_one";
const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose
  .connect(mongoDB)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const db = mongoose.connection;
// mongoose.Promise = global.Promise;

app.get("/", (req, res) => res.send("Hello guy's!"));

// just retrieving whole collection
app.get("/city", (req, res) => {
  db.collection("city")
    .find()
    .toArray((err, results) => {
      res.send(results);
    });
});

// just retrieving whole collection
// app.get("/cities", (req, res) => {
//   db.collection("cities")
//     .find()
//     .toArray((err, results) => {
//       res.send(results);
//     });
// });

// retrieving using schema
const CityModel = require("./models/City");
// console.log(CityModel);
// const city = new CityModel({
//   name: "Gdansk",
//   country: "Poland"
// });

// city
//   .save()
//   .then(doc => console.log(doc))
//   .catch(err => console.log(err));

// CityModel.find()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(err => {
//     console.error(err);
//   });

app.get("/cities/all", (req, res) => {
  CityModel.find()
    // .then(docs => console.log(docs))
    .then(docs => res.send(docs))
    .catch(err => console.log(err));
});

// Routes
// Home && test page route
const router = express.Router();

router.get("/", (req, res) => res.send("im the home page!"));
router.get("/test", (req, res) => res.send("HELLO WORLD!"));

// Use routes
app.use("/", router);

// Set up the port and send a msg when start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}!`));
