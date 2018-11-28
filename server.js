const express = require("express");

// initialize app
const app = express();

// mongoose connect
const mongoose = require("mongoose");
const dev_db_url = "mongodb://mike:mike666@ds211504.mlab.com:11504/mern_one";
const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose
  .connect(mongoDB)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const db = mongoose.connection;
// mongoose.Promise = global.Promise;  // ?? don't know if I need this

app.get("/", (req, res) => res.send("Hello guy's!"));

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

app.get("/cities/all", (req, res) => {
  CityModel.find()
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
