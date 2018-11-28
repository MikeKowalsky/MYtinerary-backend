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

// Set up the port and send a msg when start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}!`));
