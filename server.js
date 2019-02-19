const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

const cors = require("./middleware/cors");

// routes
const cityRoutes = require("./routes/api/cities");
const inineraryRoutes = require("./routes/api/itineraries");
const usersRoutes = require("./routes/api/users");
const messagesRoutes = require("./routes/api/messages");

// initialize app
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handle CORS Errors
app.use(cors);

// mongoose connect
const mongoDB = `mongodb://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@ds211504.mlab.com:11504/${process.env.MONGO_DB}`;

mongoose
  .connect(mongoDB, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// passport middleware configuaration
app.use(passport.initialize());
require("./config/passport")(passport);

// use Routes
app.use("/api/cities", cityRoutes);
app.use("/api/itineraries", inineraryRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/messages", messagesRoutes);

// set up the port and send a msg when start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}!`));
