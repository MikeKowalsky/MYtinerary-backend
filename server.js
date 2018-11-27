const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// initialize app
const app = express();

// Connect to MongoDB by Monooose
mongoose
  .connect("mongodb://mike:mike666@ds211504.mlab.com:11504/mern_one")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// app.get("/", (req, res) => res.send("Hello guy's!"));

// Routes

// home page route
router.get("/", (req, res) => res.send("im the home page!"));
router.get("/test", (req, res) => res.send("HELLO WORLD!"));

// Use routes
app.use("/", router);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}!`));
