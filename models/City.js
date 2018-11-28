const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Schemas not only define the structure of your document and casting of properties, they also define document instance methods, static Model methods, compound indexes, and document lifecycle hooks called middleware.
// https://mongoosejs.com/docs/guide.html

//Create Schema
const CitySchema = new Schema({
  name: String,
  country: String
});

module.exports = mongoose.model("City", CitySchema);
//To use our schema definition, we need to convert our CitySchema into a Model we can work with. Doing this while exporting.
