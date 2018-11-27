const express = require("express");

// initialize app
const app = express();

// Connect to MongoDB by Monooose
const mongoose = require("mongoose");
const dev_db_url = "mongodb://mike:mike666@ds211504.mlab.com:11504/mern_one";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.once("error", console.error.bind(console, "MongoDB connection error"));

// old version of mongoose connect
// mongoose
//   .connect()
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// app.get("/", (req, res) => res.send("Hello guy's!"));

app.get("/cities", (req, res) => {
  db.collection("city")
    .find()
    .toArray((err, results) => {
      res.send(results);
    });
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
